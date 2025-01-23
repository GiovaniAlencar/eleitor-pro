import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

export default function ElectoralMap({ markers, onMarkerClick }: ElectoralMapProps) {
  const mapRef = useRef<HTMLDivElement>(null); // Referência para o container do mapa
  const [updatedMarkers, setUpdatedMarkers] = useState<Marker[]>([]); // Estado para armazenar os marcadores com endereço

  // Função para buscar o endereço usando a API de Geocodificação
  const fetchAddress = (latitude: number, longitude: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      const latLng = new window.google.maps.LatLng(latitude, longitude);

      geocoder.geocode({ location: latLng }, (results: any, status: string) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject('Endereço não encontrado');
        }
      });
    });
  };

  // Função que calcula o grupo com mais marcadores
  const getMostDenseRegion = (markers: Marker[]): { lat: number; lng: number } => {
    if (markers.length === 0) {
      // Coordenadas padrão
      return { lat: -23.5505, lng: -46.6333 };
    }

    // Tolerância para agrupar marcadores (em graus de latitude/longitude)
    const groupRadius = 0.05; // Ajuste conforme necessário (menor valor = mais precisão)

    // Agrupando os marcadores em quadrantes próximos
    const groups: { [key: string]: Marker[] } = {};

    markers.forEach((marker) => {
      const groupKey = `${Math.floor(marker.latitude / groupRadius)},${Math.floor(marker.longitude / groupRadius)}`;
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(marker);
    });

    // Identificando o grupo mais denso
    const densestGroupKey = Object.keys(groups).reduce((maxKey, currentKey) => {
      return groups[currentKey].length > (groups[maxKey]?.length || 0) ? currentKey : maxKey;
    });

    const densestGroup = groups[densestGroupKey];

    // Calculando o centro da região mais densa
    const totalLat = densestGroup.reduce((sum, marker) => sum + marker.latitude, 0);
    const totalLng = densestGroup.reduce((sum, marker) => sum + marker.longitude, 0);

    return {
      lat: totalLat / densestGroup.length,
      lng: totalLng / densestGroup.length,
    };
  };

  // Função para atualizar os marcadores com o endereço
  const updateMarkersWithAddress = async (markers: Marker[]) => {
    const updated = await Promise.all(
      markers.map(async (marker) => {
        if (!marker.address) {
          try {
            const address = await fetchAddress(marker.latitude, marker.longitude);
            return { ...marker, address };
          } catch (error) {
            return { ...marker, address: 'Endereço não encontrado' };
          }
        }
        return marker;
      })
    );
    setUpdatedMarkers(updated);
  };

  useEffect(() => {
    // Atualizar os marcadores com o endereço
    updateMarkersWithAddress(markers);
  }, [markers]);

  useEffect(() => {
    // Função que inicializa o mapa
    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      // Obtendo a região com mais marcadores
      const center = getMostDenseRegion(updatedMarkers);

      // Inicializando o mapa
      const map = new window.google.maps.Map(mapRef.current, {
        center, // Centro definido dinamicamente
        zoom: 11,
        disableDefaultUI: true,
        minZoom: 6,
        gestureHandling: 'greedy',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
          {
            featureType: 'transit',
            elementType: 'all',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      // Agrupando marcadores com as mesmas coordenadas
      const groupedMarkers: { [key: string]: Marker[] } = {};

      updatedMarkers.forEach((marker) => {
        const key = `${marker.latitude},${marker.longitude}`;
        if (!groupedMarkers[key]) {
          groupedMarkers[key] = [];
        }
        groupedMarkers[key].push(marker);
      });

      // Adiciona os marcadores agrupados no mapa
      Object.keys(groupedMarkers).forEach((key) => {
        const group = groupedMarkers[key];
        const firstMarker = group[0];

        // Define a URL da imagem personalizada
        const markerIcon = {
          url: firstMarker.type === 'eleitor'
            ? '/eleitor.svg' // Ícone para eleitor
            : '/lideranca.svg', // Ícone para liderança
          scaledSize: new window.google.maps.Size(40, 40), // Tamanho do ícone
        };

        // Criando o marcador principal
        const mapMarker = new window.google.maps.Marker({
          map,
          position: { lat: firstMarker.latitude, lng: firstMarker.longitude },
          icon: markerIcon,
          title: firstMarker.type || 'Marcador',
        });

        // Criando a InfoWindow
        const infoWindow = new window.google.maps.InfoWindow();

        // Evento de clique no marcador
        mapMarker.addListener('click', () => {
          if (onMarkerClick) onMarkerClick(firstMarker);

          infoWindow.setHeaderDisabled(true);

          infoWindow.setContent(`
            <div style="font-size: 11px; max-width: 200px; z-index: 99999; margin-top: 0; padding: 0; line-height: 1.2;">
              <!-- Cabeçalho personalizado -->
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong style="margin: 0; padding: 0; display: block;">
                  ${group[0].type === 'eleitor'
              ? group.length === 1 ? 'Liderança' : 'Lideranças'
              : group.length === 1 ? 'Eleitor' : 'Eleitores'}
                </strong>
                <!-- Botão para fechar a InfoWindow e o triângulo -->
<button style="border: none; background: transparent; cursor: pointer;" onclick="
  const parentInfoWindow = this.closest('.gm-style-iw');
  if (parentInfoWindow) {
    // Fecha apenas a InfoWindow atual
    parentInfoWindow.style.display = 'none';

    // Fecha o triângulo correspondente
    const parentContainer = parentInfoWindow.parentElement;
    if (parentContainer) {
      const triangle = parentContainer.querySelector('.gm-style-iw-tc');
      if (triangle) {
        triangle.style.display = 'none';
      }
    }
  }

  // Reativa os triângulos das InfoWindows que ainda estão abertas
  document.querySelectorAll('.gm-style-iw').forEach((infoWindow) => {
    if (infoWindow.style.display !== 'none') {
      const parentContainer = infoWindow.parentElement;
      if (parentContainer) {
        const triangle = parentContainer.querySelector('.gm-style-iw-tc');
        if (triangle) {
          triangle.style.display = 'block';
        }
      }
    }
  });
">
  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>

              </div>
              <ul style="margin: 0; padding: 0; list-style: none;">
                ${group
              .map((m, index) => {
                return `<li style="margin: 0; padding: 0; display: flex; align-items: center; gap: 4px;">
                              ${m.gender === 'male'
                    ? '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.28 0 4.5-2.22 4.5-5S14.28 2 12 2 7.5 4.22 7.5 7s2.22 5 4.5 5zm0 2c-3.04 0-9 1.52-9 4.5V21h18v-2.5c0-2.98-5.96-4.5-9-4.5z"/></svg>'
                    : '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.28 0 4.5-2.22 4.5-5S14.28 2 12 2 7.5 4.22 7.5 7s2.22 5 4.5 5zm0 2c-3.04 0-9 1.52-9 4.5V21h18v-2.5c0-2.98-5.96-4.5-9-4.5z"/></svg>'
                  }
                              <a href="/${m.type === 'eleitor' ? 'lideranca' : 'voter'}/${m.id}" target="_blank" style="text-decoration: none; color: blue;">
                                ${group.length > 1 ? `${index + 1}. ${m.name || 'Sem nome'}` : `${m.name || 'Sem nome'}`}
                              </a>
                            </li>`;
              })
              .join('')}
              </ul>
              <p style="margin-top: 5%; font-size: 9px"><b>Endereço:</b> ${firstMarker.address || 'Sem endereço'}</p>
            </div>
          `);



          infoWindow.open(map, mapMarker);
        });
        // Se houver mais de um marcador, cria a bolinha de contagem
        if (group.length > 1) {
          const label = document.createElement('div');
          label.textContent = `${group.length}`;
          label.style.position = 'absolute';
          label.style.backgroundColor = 'red';
          label.style.color = 'white';
          label.style.borderRadius = '50%';
          label.style.width = '20px';
          label.style.height = '20px';
          label.style.fontSize = '12px';
          label.style.fontWeight = 'bold';
          label.style.textAlign = 'center';
          label.style.lineHeight = '20px';
          label.style.zIndex = '1'; // Define um z-index menor para a bolinha

          const overlay = new window.google.maps.OverlayView();
          overlay.onAdd = function () {
            const panes = this.getPanes();
            panes.overlayMouseTarget.appendChild(label); // Adiciona a bolinha na camada correta
          };

          overlay.draw = function () {
            const projection = this.getProjection();
            if (projection) {
              const position = projection.fromLatLngToDivPixel(
                new window.google.maps.LatLng(firstMarker.latitude, firstMarker.longitude)
              );
              if (position) {
                label.style.left = `${position.x + 8}px`;
                label.style.top = `${position.y - 45}px`;
              }
            }
          };

          overlay.onRemove = function () {
            if (label.parentNode) label.parentNode.removeChild(label);
          };

          overlay.setMap(map);
        }
      });
    };

    // Inicializando o mapa
    initializeMap();
  }, [updatedMarkers, onMarkerClick]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '750px',
      }}
    />
  );
}

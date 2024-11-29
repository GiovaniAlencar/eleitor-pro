@component('mail::message')
# Recuperação de Senha

Olá {{ $user->name }},

Você solicitou a recuperação de senha da sua conta no Eleitor Pro.

@component('mail::button', ['url' => config('app.url') . '/reset-password?token=' . $token])
Redefinir Senha
@endcomponent

Este link expira em 60 minutos.

Se você não solicitou a recuperação de senha, ignore este email.

Atenciosamente,<br>
{{ config('app.name') }}
@endcomponent
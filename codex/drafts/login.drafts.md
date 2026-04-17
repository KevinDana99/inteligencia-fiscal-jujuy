## Contenedor de login

## Toda la implementacion debe estar usando mantine ui salvo los casos donde es limitante.

0. Referencia visual en : `codex/assets/design/auth/login.design.png`
1. debe ser <Paper> shadow-xl radius-lg p-xl con width:100%;max-width:440px
2. para el contenedor de titulo y subtitulo del login debe ser <Stack> gap-xs mb-lg text-center
3. el title debe ser <Title> order-2 con un salto de linea <br> antes de fiscal
   font-family: var(--font);
   font-weight: 800;
   color: var(--gray-9);
   letter-spacing: -.3px;
   font-size: 22px;
4. para el subtitle <Text> c-dimmed fz-sm
   color: var(--gray-6);
   font-size: 12.5px;
5. el subtitulo debe ser “Panel de Administración — Acceso restringido”
6. 1. Input label - (email and password) usando mantine ui:
      font-size: 12px;
      font-weight: 700;
      color: var(--gray-7);
      text-transform: uppercase;
      letter-spacing: .3px;
   2. <Input> :
      width: 100%;
      padding: 10px 14px;
      border: 1.5px solid var(--gray-3);
      border-radius: var(--radius-md);
      font-family: var(--font);
      font-size: 13.5px;
      color: var(--gray-9);
      background: var(--gray-0);
      outline: none;
      transition: border-color .15s, box-shadow .15s;
7. box icon eye en password size 16px color gray-5 svg size 24
8. alerta de error o excepcion <Alert> variant-light red-5 mb-sm
   background: #fff0f0;
   border: 1px solid #ffa8a8;
   border-left: 4px solid var(--red-5);
   color: var(--red-6);
9. error icon mantine ui referencia: `codex/assets/design/auth/error/`
10. la seccion de olvidaste tu contraseña ya no tiene que redirigir a ninguna parte tiene que poner un <Alert> color blue-5 que siga que debes contactarte con soporte para cambiar la contraseña.
11. <Button> variant-filled blue-5 size-lg radius-full fullWidth
    background: var(--blue-5);
    color: #fff;

# K3s dev

Manifiestos minimos para ejecutar el frontend de Rentas IF en el entorno dev `192.168.119.106`.

```powershell
kubectl apply -k k3s
```

El overlay crea:

- namespace `rentas-if`
- frontend Next.js
- ingress `app.rentas-if.dev.local`
- politica de red para entrada desde Traefik

El frontend usa el backend por Service DNS interno: `http://rentas-if-backend.rentas-if.svc.cluster.local`.

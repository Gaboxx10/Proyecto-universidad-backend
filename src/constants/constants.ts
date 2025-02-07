export enum Rol {
  ADMIN = 'ADMIN',
  ASISTENTE = 'ASISTENTE',
  MECANICO = 'MECANICO',
}

export enum Modules {
  CLIENT = 'CLIENT',
  VEHICLE = 'VEHICLE',
  FACTURA = 'FACTURA',
  USUARIO = 'USUARIO',
}

export enum EstadoReparacion {
  REGISTRADO = 'REGISTRADO',
  EN_DIAGNOSTICO = 'EN DIAGNOSTICO',
  EN_REPARACION = 'EN REPARACION',
  EN_MANTENIMIENTO = 'EN MANTENIMIENTO',
  EN_ESPERA = 'EN ESPERA',
  REPARADO = 'REPARADO',
  NO_REPARABLE = 'NO REPARABLE',
  ENTREGADO = 'ENTREGADO',
}

export enum Modules {
  cliente = 'cliente',
  empresa = 'empresa',
  dashboard = "dashboard",
  diagnostico = "diagnostico",
  factura = "factura",
  ordenTrabajo = "orden-trabajo",
  presupuesto = "presupuesto",
  profile = "profile",
  usuario = "usuario",
  proveedores = "proveedores",
  vehiculo = "vehiculo"
}

export enum TipoPersona {
  CLIENTE = 'CLIENTE',
  USUARIO = 'USUARIO',
}

export enum TipoCliente {
  PERSONA = 'PERSONA_NATURAL',
  EMPRESA = 'EMPRESA',
}

export const CATEGORIES = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Furniture', label: 'Furniture' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Toys', label: 'Toys' },
  { value: 'Groceries', label: 'Groceries' },
  { value: 'Books', label: 'Books' },
  { value: 'Jewelry', label: 'Jewelry' },
  { value: 'Beauty Products', label: 'Beauty Products' }
];

export const AREAS = [
  { id: 'ventas', label: 'Ventas' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'tecnologia', label: 'Tecnología' },
  { id: 'recursos-humanos', label: 'Recursos Humanos' },
  { id: 'finanzas', label: 'Finanzas' }
];

export const SUB_AREAS = [
  // Ventas
  { id: 'ventas-directas', label: 'Ventas Directas', areaId: 'ventas' },
  { id: 'ventas-online', label: 'Ventas Online', areaId: 'ventas' },
  { id: 'atencion-cliente', label: 'Atención al Cliente', areaId: 'ventas' },

  // Marketing
  { id: 'marketing-digital', label: 'Marketing Digital', areaId: 'marketing' },
  { id: 'publicidad', label: 'Publicidad', areaId: 'marketing' },
  { id: 'redes-sociales', label: 'Redes Sociales', areaId: 'marketing' },
  { id: 'contenido', label: 'Contenido', areaId: 'marketing' },

  // Tecnología
  { id: 'desarrollo', label: 'Desarrollo', areaId: 'tecnologia' },
  { id: 'infraestructura', label: 'Infraestructura', areaId: 'tecnologia' },
  { id: 'soporte-tecnico', label: 'Soporte Técnico', areaId: 'tecnologia' },
  { id: 'seguridad', label: 'Seguridad', areaId: 'tecnologia' },

  // Recursos Humanos
  { id: 'reclutamiento', label: 'Reclutamiento', areaId: 'recursos-humanos' },
  { id: 'capacitacion', label: 'Capacitación', areaId: 'recursos-humanos' },
  { id: 'nomina', label: 'Nómina', areaId: 'recursos-humanos' },

  // Finanzas
  { id: 'contabilidad', label: 'Contabilidad', areaId: 'finanzas' },
  { id: 'tesoreria', label: 'Tesorería', areaId: 'finanzas' },
  { id: 'auditoria', label: 'Auditoría', areaId: 'finanzas' }
];

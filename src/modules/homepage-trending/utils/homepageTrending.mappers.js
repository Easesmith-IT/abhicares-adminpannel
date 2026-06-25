const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function getCityScopedConfig(entity) {
  if (!Array.isArray(entity?.cityConfigs) || entity.cityConfigs.length === 0) {
    return null;
  }

  return entity.cityConfigs[0];
}

export function formatCurrency(amount) {
  if (typeof amount !== "number") {
    return "--";
  }

  return currencyFormatter.format(amount);
}

export function formatDate(value) {
  if (!value) {
    return "--";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "--";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function buildServiceTogglePayload(cityId, nextValue) {
  return {
    cityConfigs: [{ cityId, appHomepage: nextValue }],
  };
}

export function buildCatalogTogglePayload(cityId, nextValue) {
  return {
    cityConfigs: [{ cityId, showOnHomepage: nextValue }],
  };
}

export function mapHomepageTrendingService(entity) {
  const cityConfig = getCityScopedConfig(entity);

  return {
    id: entity._id,
    name: entity.name,
    categoryId: entity.categoryId,
    categoryName: entity.categoryName || "--",
    cityName: cityConfig?.cityName || "--",
    startingPrice: cityConfig?.startingPrice ?? null,
    homepageEnabled: Boolean(cityConfig?.appHomepage),
    createdAt: entity.createdAt,
    detailsHref: entity.categoryId
      ? `/admin/categories/${entity.categoryId}/product/${entity._id}`
      : null,
  };
}

export function mapHomepageTrendingProduct(entity) {
  const cityConfig = getCityScopedConfig(entity);

  return {
    id: entity._id,
    name: entity.name,
    serviceId: entity.serviceId,
    serviceName: entity.serviceName || "--",
    categoryId: entity.categoryId,
    categoryName: entity.categoryName || "--",
    cityName: cityConfig?.cityName || "--",
    price: cityConfig?.price ?? null,
    offerPrice: cityConfig?.offerPrice ?? null,
    durationMinutes: entity.durationMinutes ?? null,
    rating: entity.rating ?? 0,
    homepageEnabled: Boolean(cityConfig?.showOnHomepage),
    detailsHref:
      entity.categoryId && entity.serviceId
        ? `/admin/categories/${entity.categoryId}/product/${entity.serviceId}/info/${entity._id}`
        : null,
  };
}

export function mapHomepageTrendingPackage(entity) {
  const cityConfig = getCityScopedConfig(entity);

  return {
    id: entity._id,
    name: entity.name,
    serviceId: entity.serviceId,
    serviceName: entity.serviceName || "--",
    categoryId: entity.categoryId,
    categoryName: entity.categoryName || "--",
    cityName: cityConfig?.cityName || "--",
    price: cityConfig?.price ?? null,
    offerPrice: cityConfig?.offerPrice ?? null,
    durationMinutes: entity.durationMinutes ?? null,
    productsCount: Array.isArray(entity.products) ? entity.products.length : 0,
    rating: entity.rating ?? 0,
    homepageEnabled: Boolean(cityConfig?.showOnHomepage),
    detailsHref:
      entity.categoryId && entity.serviceId
        ? `/admin/categories/${entity.categoryId}/package/${entity.serviceId}/info/${entity._id}`
        : null,
  };
}

export function collectCategoryOptions(rows) {
  const categoryMap = new Map();

  rows.forEach((row) => {
    if (!row.categoryId || !row.categoryName) {
      return;
    }

    categoryMap.set(String(row.categoryId), {
      value: String(row.categoryId),
      label: row.categoryName,
    });
  });

  return Array.from(categoryMap.values()).sort((left, right) =>
    left.label.localeCompare(right.label),
  );
}

export function collectServiceOptions(rows) {
  const serviceMap = new Map();

  rows.forEach((row) => {
    if (!row.serviceId || !row.serviceName) {
      return;
    }

    serviceMap.set(String(row.serviceId), {
      value: String(row.serviceId),
      label: row.serviceName,
    });
  });

  return Array.from(serviceMap.values()).sort((left, right) =>
    left.label.localeCompare(right.label),
  );
}

export function mergeFilterOptions(currentOptions, nextOptions) {
  const optionMap = new Map();

  [...currentOptions, ...nextOptions].forEach((option) => {
    if (!option?.value) {
      return;
    }

    optionMap.set(String(option.value), {
      value: String(option.value),
      label: option.label,
    });
  });

  return Array.from(optionMap.values()).sort((left, right) =>
    left.label.localeCompare(right.label),
  );
}

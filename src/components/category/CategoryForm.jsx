import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCities } from "@/components/filters/city";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { BackLink } from "@/components/shared/back-link";
import { H2 } from "@/components/shared/typography";
import { categorySchema } from "../../schemas/service.schema";
import { CityCardCategorySkeleton } from "./CityCardSkeleton";

const CategoryForm = ({ defaultValues, onSubmit, isLoading, label }) => {
  const {
    cities,
    page,
    totalPages,
    nextPage,
    prevPage,
    isLoading: cityLoading,
  } = useCities();

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      cityConfigs: [],
      ...defaultValues,
    },
  });

  const { watch, setValue, getValues } = form;
  const cityConfigs = watch("cityConfigs") || [];

  /**
   * Merge paginated cities into cityConfigs (same pattern as ServiceForm)
   */
  useEffect(() => {
    if (!cities.length) return;

    const existing = getValues("cityConfigs") || [];
    const cityMap = new Map(cities.map((c) => [c._id, c.name]));

    const merged = [
      ...existing.map((cfg) => ({
        ...cfg,
        cityName: cfg.cityName ?? cityMap.get(cfg.cityId),
      })),
      ...cities
        .filter((c) => !existing.some((e) => e.cityId === c._id))
        .map((city) => ({
          cityId: city._id,
          cityName: city.name,
          isActive: false,
          commission: 0,
          convenience: 0,
        })),
    ];

    setValue("cityConfigs", merged, { shouldDirty: false });
  }, [cities]);

  const visibleCityIds = useMemo(
    () => new Set(cities.map((c) => c._id)),
    [cities],
  );

  const visibleConfigs = useMemo(
    () => cityConfigs.filter((c) => visibleCityIds.has(c.cityId)),
    [cityConfigs, visibleCityIds],
  );

  return (
    <div className="space-y-6">
      <BackLink href={-1}>
        <H2>{label}</H2>
      </BackLink>

      <Card>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>Category Name</Label>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City Configs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cityLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <CityCardCategorySkeleton key={i} />
                    ))
                  : visibleConfigs.map((city) => {
                      const index = cityConfigs.findIndex(
                        (c) => c.cityId === city.cityId,
                      );

                      const isActive = watch(`cityConfigs.${index}.isActive`);

                      return (
                        <Card key={city.cityId}>
                          <CardContent className="space-y-4">
                            <div className="flex justify-between">
                              <h3 className="font-semibold uppercase">
                                {city.cityName}
                              </h3>

                              <FormField
                                control={form.control}
                                name={`cityConfigs.${index}.isActive`}
                                render={({ field }) => (
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-orange-500"
                                    />
                                    <Badge
                                      variant={
                                        field.value ? "success" : "inprogress"
                                      }
                                    >
                                      {field.value ? "Active" : "Inactive"}
                                    </Badge>
                                  </div>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name={`cityConfigs.${index}.commission`}
                              render={({ field }) => (
                                <FormItem>
                                  <Label>Commission (%)</Label>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      disabled={!isActive}
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`cityConfigs.${index}.convenience`}
                              render={({ field }) => (
                                <FormItem>
                                  <Label>Convenience Fee</Label>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      disabled={!isActive}
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>
                      );
                    })}
              </div>

              {/* Pagination */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevPage}
                  disabled={page === 1}
                >
                  Prev
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={nextPage}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="abhicares"
                  type="submit"
                  disabled={isLoading || cityLoading}
                >
                  {isLoading ? <Spinner /> : label}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryForm;

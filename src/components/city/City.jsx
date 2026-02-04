import React from 'react'

export default function City({city}) {
    const hasPolygon = city?.area?.coordinates?.[0]?.length > 2;
    
  return (
    <Card key={city._id}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base capitalize">{city.city}</CardTitle>

        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleUpdateModal(city)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={() => handleDeleteModal(city._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-1 text-sm">
        <p>
          <span className="font-medium">State:</span> {city.state}
        </p>
        <p>
          <span className="font-medium">Pincodes:</span>{" "}
          {city.pinCodes.map((item) => item?.code).join(", ") || "NA"}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant={hasPolygon ? "success" : "secondary"}>
            {hasPolygon ? "Added" : "Not Added"}
          </Badge>

          {hasPolygon && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPolygonOpen(true)}
            >
              View
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

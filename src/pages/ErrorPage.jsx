import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen overflow-hidden items-center justify-center bg-linear-to-br from-background via-muted/40 to-background px-4">
      {/* Background blur blobs */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-main/20 blur-3xl" />

      <Card className="relative z-10 max-w-md w-full border-muted/60 bg-background/80 backdrop-blur-xl shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="text-7xl font-extrabold tracking-tight bg-gradient-to-r from-main to-main/50 bg-clip-text text-transparent">
            404
          </div>

          <CardTitle className="text-2xl">Page not found</CardTitle>

          <p className="text-sm text-muted-foreground">
            Sorry, the page you’re looking for doesn’t exist or was moved.
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <Button variant="abhicares" size="lg" className="w-full" onClick={() => navigate(-1)}>
            Go Back
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate("/")}
          >
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;

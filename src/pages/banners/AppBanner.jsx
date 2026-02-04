import { Link } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Wrapper from "../../components/wrappers/Wrapper";

const AppBanner = () => {
  return (
    <Wrapper>
      <div className="m-6 space-y-6">
        <h1 className="text-2xl font-semibold">App Banners</h1>

        <Tabs defaultValue="home">
          <TabsList>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="category">Category</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
            <TabsTrigger value="product">Product</TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <BannerCard to="/admin/banners/app/home" label="Home Page" />
          </TabsContent>

          <TabsContent value="category">
            <BannerCard
              to="/admin/banners/app/category"
              label="Category Page"
            />
          </TabsContent>

          <TabsContent value="service">
            <BannerCard to="/admin/banners/app/service" label="Service Page" />
          </TabsContent>

          <TabsContent value="product">
            <BannerCard to="/admin/banners/app/product" label="Product Page" />
          </TabsContent>
        </Tabs>
      </div>
    </Wrapper>
  );
};

const BannerCard = ({ to, label }) => (
  <Card>
    <CardContent className="p-6">
      <Link to={to} className="text-lg font-medium hover:underline">
        {label} →
      </Link>
    </CardContent>
  </Card>
);

export default AppBanner;

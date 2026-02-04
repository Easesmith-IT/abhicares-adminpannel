
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Wrapper from "../../components/wrappers/Wrapper";
import AppHomeBanner from "../../components/banner/AppHomeBanner";
import AppCategoryBanner from "../../components/banner/AppCategoryBanner";
import AppServiceBanner from "../../components/banner/AppServiceBanner";
import AppProductBanner from "../../components/banner/AppProductBanner";
import WebsiteHomeBanner from "../../components/banner/WebsiteHomeBanner";

/**
 * Replace these placeholders with your actual banner components:
 * <AppHomeBanner />
 * <AppCategoryBanner />
 * etc.
 */

const Banner = () => {
  return (
    <Wrapper>
      <div className="m-6 space-y-6">
        <h1 className="text-2xl font-semibold">Banners</h1>

        {/* PRIMARY TABS */}
        <Tabs defaultValue="app" className="w-full">
          <TabsList>
            <TabsTrigger value="app">App Banners</TabsTrigger>
            <TabsTrigger value="website">Website Banners</TabsTrigger>
          </TabsList>

          {/* ================= APP BANNERS ================= */}
          <TabsContent value="app">
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="home">
                  <TabsList className="mb-4">
                    <TabsTrigger value="home">Home</TabsTrigger>
                    <TabsTrigger value="category">Category</TabsTrigger>
                    <TabsTrigger value="service">Service</TabsTrigger>
                    <TabsTrigger value="product">Product</TabsTrigger>
                  </TabsList>

                  <TabsContent value="home">
                    <AppHomeBanner />
                  </TabsContent>

                  <TabsContent value="category">
                    <AppCategoryBanner />
                  </TabsContent>

                  <TabsContent value="service">
                    <AppServiceBanner />
                  </TabsContent>

                  <TabsContent value="product">
                    <AppProductBanner />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= WEBSITE BANNERS ================= */}
          <TabsContent value="website">
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="home">
                  <TabsList className="mb-4">
                    <TabsTrigger value="home">Home</TabsTrigger>
                  </TabsList>

                  <TabsContent value="home">
                    <WebsiteHomeBanner />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Wrapper>
  );
};

/* ---------------------------------------------
   TEMP PLACEHOLDER (remove later)
--------------------------------------------- */
const BannerPlaceholder = ({ label }) => (
  <div className="rounded-md border border-dashed p-6 text-center text-muted-foreground">
    {label} component goes here
  </div>
);

export default Banner;

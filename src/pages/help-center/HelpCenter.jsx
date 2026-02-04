import Wrapper from "../../components/wrappers/Wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H2 } from "../../components/shared/typography";

import HelpCenterTickets from "../../components/help-center/HelpCenterTickets";
import HelpCenterFaqs from "../../components/help-center/HelpCenterFaqs";

const AdminHelpCenter = () => {
  return (
    <Wrapper>
      <div className="w-full font-poppins space-y-6">
        <H2>Help Center</H2>

        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets">
            <HelpCenterTickets />
          </TabsContent>

          <TabsContent value="faqs">
            <HelpCenterFaqs />
          </TabsContent>
        </Tabs>
      </div>
    </Wrapper>
  );
};

export default AdminHelpCenter;

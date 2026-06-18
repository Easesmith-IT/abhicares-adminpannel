import { useLocation, useNavigate } from "react-router-dom";
import SellerForm from "../../components/partner/SellerForm";
import usePatchApiReq from "../../hooks/usePatchApiReq";
import { useEffect } from "react";
import Wrapper from "../../components/wrappers/Wrapper";
import { BackLink } from "../../components/shared/back-link";
import { UserCheck, ShieldAlert } from "lucide-react";

const UpdateSeller = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const seller = state?.seller;

  const { res, fetchData, isLoading } = usePatchApiReq();

  const handleUpdate = async (formData) => {
    await fetchData(`/sellers/update-seller/${seller._id}`, formData);
  };

  useEffect(() => {
    if (res?.status === 200 || res?.status === 201) {
      navigate("/admin/partners");
    }
  }, [res, navigate]);

  if (!seller) {
    return (
      <Wrapper>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
          <ShieldAlert className="size-12 text-rose-500 animate-bounce" />
          <h3 className="text-xl font-semibold text-slate-800">No Partner Data Provided</h3>
          <p className="text-sm text-slate-500 max-w-sm">Please navigate to this page from the partners list or details console.</p>
          <BackLink href={-1}>
            <span className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition">Go Back</span>
          </BackLink>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="space-y-6 max-w-[1200px] mx-auto px-4 sm:px-6 py-6 text-slate-900 bg-[#F8FAFC] min-h-screen">
        
        {/* Navigation & Header */}
        <div className="flex flex-col gap-2">
          <BackLink href={-1}>
            <span className="text-sm text-slate-500 hover:text-slate-800 transition">
              Back to Partner Details
            </span>
          </BackLink>
          <div className="flex items-center gap-3 mt-2">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <UserCheck className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Update Partner Profile
              </h1>
              <p className="text-sm text-slate-500">
                Modify personal credentials, onboarding details, document attachments, and banking information for <span className="font-semibold text-slate-800">{seller.name}</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/50 backdrop-blur-sm border border-slate-100/80 rounded-3xl p-6 sm:p-8 shadow-sm">
          <SellerForm
            initialData={seller}
            onSubmit={handleUpdate}
            isEdit
            isLoading={isLoading}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default UpdateSeller;

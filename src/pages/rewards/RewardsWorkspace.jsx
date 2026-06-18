import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Award,
  DollarSign,
  Users,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

import useGetApiReq from "../../hooks/useGetApiReq";
import usePutApiReq from "../../hooks/usePutApiReq";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Wrapper from "../../components/wrappers/Wrapper";

const RewardsWorkspace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "config" ? "config" : "overview";

  // Tabs: "overview" | "config"
  const [activeTab, setActiveTab] = useState(initialTab);

  // API Request Hooks
  const { res: getSettingsRes, fetchData: getSettings } = useGetApiReq();
  const { res: updateSettingsRes, fetchData: updateSettings, isLoading: updateSettingsLoading } = usePutApiReq();

  // Settings State
  const [settings, setSettings] = useState({
    globalReferrerAmount: 50,
    globalReferredJoiningAmount: 10,
    pointsEarnedPerRupeeSpent: 0.05,
    conversionRate: 5,
    maxUsagePercentPerCart: 20,
    minCartValueForRedemption: 500,
    maxPointsRedeemablePerOrder: 200,
  });

  // Fetch functions
  const fetchSettings = () => {
    getSettings("/rewards/settings");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab === "config" ? { tab: "config" } : {});
  };

  // Load Initial Settings
  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab") === "config" ? "config" : "overview";
    setActiveTab(tab);
  }, [searchParams]);

  // Bind settings response
  useEffect(() => {
    if (getSettingsRes?.status === 200 && getSettingsRes?.data?.data) {
      setSettings(getSettingsRes.data.data);
    }
  }, [getSettingsRes]);

  // Handle setting updates
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    if (Number(settings.conversionRate) < 1) {
      toast.error("Conversion rate must be 1 or higher.");
      return;
    }
    updateSettings("/rewards/settings", settings);
  };

  useEffect(() => {
    if (updateSettingsRes?.status === 200 || updateSettingsRes?.status === 201) {
      toast.success("Reward settings updated successfully.");
      fetchSettings();
    }
  }, [updateSettingsRes]);

  // Previews
  const spendRateExample = settings.pointsEarnedPerRupeeSpent
    ? Math.round(1 / Number(settings.pointsEarnedPerRupeeSpent))
    : 20;

  const valuePerHundredPoints = settings.conversionRate
    ? Math.round(100 / Number(settings.conversionRate))
    : 20;

  return (
    <Wrapper>
      <div className="space-y-6">
        
        {/* Header Title */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Rewards & Referral Studio
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure points conversion, manage joiner bonuses, and set global referral rules.
            </p>
          </div>
        </div>

        {/* Dashboard Analytics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Card className="border border-slate-100 bg-white shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-400 uppercase">
                Global Referral Rate
              </CardTitle>
              <Users className="size-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {settings.globalReferrerAmount} pts
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                Referrer bonus (New signup earns {settings.globalReferredJoiningAmount} pts)
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-100 bg-white shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-400 uppercase">
                Conversion Rate
              </CardTitle>
              <DollarSign className="size-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {settings.conversionRate} pts = ₹1
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                Value: 100 points = ₹{valuePerHundredPoints} discount
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-100 bg-white shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-400 uppercase">
                Earning Multiplier
              </CardTitle>
              <Award className="size-4 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {settings.pointsEarnedPerRupeeSpent} pts/₹
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                Equivalent: 1 point earned per ₹{spendRateExample} spent
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-100 bg-white shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-400 uppercase">
                Redemption limits
              </CardTitle>
              <TrendingUp className="size-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                Max {settings.maxUsagePercentPerCart}%
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                On carts ≥ ₹{settings.minCartValueForRedemption} (cap {settings.maxPointsRedeemablePerOrder} pts)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-slate-200 pb-3">
          <Button
            variant={activeTab === "overview" ? "abhicares" : "ghost"}
            onClick={() => handleTabChange("overview")}
            className="rounded-xl px-4 py-2"
          >
            Overview & Stats
          </Button>
          <Button
            variant={activeTab === "config" ? "abhicares" : "ghost"}
            onClick={() => handleTabChange("config")}
            className="rounded-xl px-4 py-2"
          >
            Global Configurations
          </Button>
        </div>

        {/* Tab Content: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-slate-100 bg-white shadow-sm rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Point circulation audit</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The rewards system utilizes a virtual point system to incentivize referrals and repeat bookings:
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pl-4 list-disc">
                <li>
                  <strong>Referrals:</strong> When a user invites a friend, the referrer receives <strong>{settings.globalReferrerAmount} points</strong> and the joiner gets <strong>{settings.globalReferredJoiningAmount} points</strong>.
                </li>
                <li>
                  <strong>Checkout redemption:</strong> Points are converted back to rupees at a rate of <strong>{settings.conversionRate} points = ₹1</strong>.
                </li>
                <li>
                  <strong>Loyalty earnings:</strong> Users receive points automatically upon completing services based on the order value.
                </li>
              </ul>
            </Card>

            <Card className="border border-slate-100 bg-white shadow-sm rounded-2xl p-6 flex flex-col justify-center items-center text-center space-y-3">
              <CheckCircle className="size-12 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-800">System Status: Active</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                The database singleton is connected and cached. Earning and conversion rules are synchronized automatically.
              </p>
            </Card>
          </div>
        )}

        {/* Tab Content: Global Config */}
        {activeTab === "config" && (
          <Card className="border border-slate-100 bg-white shadow-sm rounded-3xl p-6">
            <form onSubmit={handleSettingsSubmit} className="space-y-6 max-w-2xl">
              
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Referral Rules Configuration
                </h3>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="globalReferrerAmount" className="text-xs text-slate-500 font-medium">
                      Global Referrer Reward (Points)
                    </Label>
                    <Input
                      id="globalReferrerAmount"
                      type="number"
                      value={settings.globalReferrerAmount}
                      onChange={(e) => setSettings(prev => ({ ...prev, globalReferrerAmount: Number(e.target.value) }))}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="globalReferredJoiningAmount" className="text-xs text-slate-500 font-medium">
                      Joining Signup Reward (Points)
                    </Label>
                    <Input
                      id="globalReferredJoiningAmount"
                      type="number"
                      value={settings.globalReferredJoiningAmount}
                      onChange={(e) => setSettings(prev => ({ ...prev, globalReferredJoiningAmount: Number(e.target.value) }))}
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Loyalty Earning Rules
                </h3>
                <div className="space-y-1.5">
                  <Label htmlFor="pointsEarnedPerRupeeSpent" className="text-xs text-slate-500 font-medium">
                    Points Earned per ₹1 Spent
                  </Label>
                  <div className="flex gap-4 items-center">
                    <Input
                      id="pointsEarnedPerRupeeSpent"
                      type="number"
                      step="0.001"
                      value={settings.pointsEarnedPerRupeeSpent}
                      onChange={(e) => setSettings(prev => ({ ...prev, pointsEarnedPerRupeeSpent: Number(e.target.value) }))}
                      required
                      className="rounded-xl w-1/3"
                    />
                    <span className="text-xs text-slate-400 font-medium italic">
                      (Yields: 1 point earned per ₹{spendRateExample} spent)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Points Redemption & Limits
                </h3>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="conversionRate" className="text-xs text-slate-500 font-medium">
                      Conversion Rate (points = ₹1)
                    </Label>
                    <Input
                      id="conversionRate"
                      type="number"
                      value={settings.conversionRate}
                      onChange={(e) => setSettings(prev => ({ ...prev, conversionRate: Number(e.target.value) }))}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="maxUsagePercentPerCart" className="text-xs text-slate-500 font-medium">
                      Max Usage Percent per Cart (%)
                    </Label>
                    <Input
                      id="maxUsagePercentPerCart"
                      type="number"
                      value={settings.maxUsagePercentPerCart}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxUsagePercentPerCart: Number(e.target.value) }))}
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="minCartValueForRedemption" className="text-xs text-slate-500 font-medium">
                      Min Cart Value to Unlock Points (₹)
                    </Label>
                    <Input
                      id="minCartValueForRedemption"
                      type="number"
                      value={settings.minCartValueForRedemption}
                      onChange={(e) => setSettings(prev => ({ ...prev, minCartValueForRedemption: Number(e.target.value) }))}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="maxPointsRedeemablePerOrder" className="text-xs text-slate-500 font-medium">
                      Max Points Redeemable per Order
                    </Label>
                    <Input
                      id="maxPointsRedeemablePerOrder"
                      type="number"
                      value={settings.maxPointsRedeemablePerOrder}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxPointsRedeemablePerOrder: Number(e.target.value) }))}
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Live Calculator Card */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 max-w-md">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Settings conversion preview
                </span>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  👉 100 points will yield a discount of <strong className="text-blue-600">₹{valuePerHundredPoints}</strong>.
                </p>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                  👉 Users will earn <strong className="text-blue-600">10 points</strong> on a ₹{spendRateExample * 10} booking.
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  variant="abhicares"
                  type="submit"
                  disabled={updateSettingsLoading}
                  className="rounded-xl px-5"
                >
                  {updateSettingsLoading ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </Card>
        )}

      </div>
    </Wrapper>
  );
};

export default RewardsWorkspace;

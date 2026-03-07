import { useState, useEffect } from "react";
import { Typography, Tabs, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useStatisticsStore } from "../../stores/dashboardStore";
import { useAccountStore } from "../../stores/accountStore";
import { useCategoryStore } from "../../stores/categoryStore";
import OverviewTab from "./OverviewTab";
import MarketTab from "./MarketTab";
import AccountTab from "./AccountTab";
import CategoryTab from "./CategoryTab";

const { Title } = Typography;

export default function StatisticsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMarket, setSelectedMarket] = useState("US");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const { overview, loadingOverview, fetchOverview } = useStatisticsStore();
  const { accounts, fetchAccounts } = useAccountStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchOverview();
    fetchAccounts();
    fetchCategories();
  }, [fetchOverview, fetchAccounts, fetchCategories]);

  // Preselect first account and category
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const handleRefresh = () => {
    fetchOverview();
  };

  const tabs = [
    {
      key: "overview",
      label: "整体统计",
      children: <OverviewTab overview={overview} loading={loadingOverview} />,
    },
    {
      key: "market",
      label: "按市场",
      children: (
        <MarketTab
          selectedMarket={selectedMarket}
          onMarketChange={setSelectedMarket}
        />
      ),
    },
    {
      key: "account",
      label: "按账户",
      children: (
        <AccountTab
          selectedAccountId={selectedAccountId}
          onAccountChange={setSelectedAccountId}
        />
      ),
    },
    {
      key: "category",
      label: "按类别",
      children: (
        <CategoryTab
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={setSelectedCategoryId}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={2} className="!mb-0">
          📈 统计分析
        </Title>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={loadingOverview}
          size="small"
        >
          刷新
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabs}
        destroyInactiveTabPane={false}
      />
    </div>
  );
}

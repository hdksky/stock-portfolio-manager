use serde::{Deserialize, Serialize};

/// Configuration for which quote data provider to use per market.
///
/// Supported providers:
/// - `"yahoo"`     – Yahoo Finance, supports HK / US
/// - `"eastmoney"` – East Money (东方财富), supports CN / HK / US
/// - `"xueqiu"`    – Xueqiu (雪球), supports CN / HK / US
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuoteProviderConfig {
    /// Provider for US stocks: "xueqiu" (default)
    pub us_provider: String,
    /// Provider for HK stocks: "xueqiu" (default)
    pub hk_provider: String,
    /// Provider for CN A-shares: "xueqiu" (default)
    pub cn_provider: String,
    /// Optional user-provided Xueqiu cookie string (e.g. copied from a
    /// logged-in browser session).  When set, API requests to Xueqiu will use
    /// this cookie instead of the automatically obtained anonymous token.
    #[serde(default)]
    pub xueqiu_cookie: Option<String>,
}

impl Default for QuoteProviderConfig {
    fn default() -> Self {
        QuoteProviderConfig {
            us_provider: "xueqiu".to_string(),
            hk_provider: "xueqiu".to_string(),
            cn_provider: "xueqiu".to_string(),
            xueqiu_cookie: None,
        }
    }
}

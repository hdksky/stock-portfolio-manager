use serde::{Deserialize, Serialize};

/// Configuration for which quote data provider to use per market.
///
/// Supported providers:
/// - `"xueqiu"` – Xueqiu (雪球), supports CN / HK / US
/// - `"yahoo"`  – Yahoo Finance, supports HK / US only
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuoteProviderConfig {
    /// Provider for US stocks: "xueqiu" (default) or "yahoo"
    pub us_provider: String,
    /// Provider for HK stocks: "xueqiu" (default) or "yahoo"
    pub hk_provider: String,
    /// Provider for CN A-shares: "xueqiu" only
    pub cn_provider: String,
}

impl Default for QuoteProviderConfig {
    fn default() -> Self {
        QuoteProviderConfig {
            us_provider: "xueqiu".to_string(),
            hk_provider: "xueqiu".to_string(),
            cn_provider: "xueqiu".to_string(),
        }
    }
}

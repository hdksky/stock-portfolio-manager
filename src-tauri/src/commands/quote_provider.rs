use crate::db::Database;
use crate::models::quote_provider::QuoteProviderConfig;
use crate::services::quote_provider_service;
use tauri::State;

#[tauri::command(rename_all = "camelCase")]
pub async fn get_quote_provider_config(
    db: State<'_, Database>,
) -> Result<QuoteProviderConfig, String> {
    quote_provider_service::get_quote_provider_config(&db)
}

#[tauri::command(rename_all = "camelCase")]
pub async fn update_quote_provider_config(
    db: State<'_, Database>,
    config: QuoteProviderConfig,
) -> Result<bool, String> {
    quote_provider_service::update_quote_provider_config(&db, &config)
}

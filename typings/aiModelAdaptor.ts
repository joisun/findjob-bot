export enum AgentsType {
    "XunFeiSpark" = "XunFeiSpark",
    "ChatAnywhere" = "ChatAnywhere",
    "Kimi" = "Kimi"
}
export type AiAgentApiKey = {
    agentName: AgentsType,
    apiKey: string
}
export type AiAgentApiKeys = AiAgentApiKey[]



export enum AgentsType {
    "XunFeiSpark" = "XunFeiSpark",
    "ChatAnywhere" = "ChatAnywhere"
}
export type AiAgentApiKey = {
    agentName: AgentsType,
    apiKey: string
}
export type AiAgentApiKeys = AiAgentApiKey[]



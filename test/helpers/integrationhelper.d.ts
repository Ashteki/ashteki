declare module jasmine {
    interface Matchers {
        toHavePrompt(expected: string): boolean;
        toHavePromptTitle(expected: string): boolean;
        toHaveDefaultPrompt(): boolean;
        toBeAbleToSelect(expected: object): boolean;
        toBeAbleToSelectDie(expected: object): boolean;
        toHaveRecentChatMessage(expected: string): boolean;
        toHavePromptButton(expected: string | number): boolean;
        toBeAbleToPlay(expected: object): boolean;
        toHavePromptCardButton(expected: object): boolean;
    }
}

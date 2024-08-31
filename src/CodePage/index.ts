export function encodeText(text: string): number[] {
    const bytes = [];
    for (let i = 0; i < text.length; i++) {
        bytes.push(text.charCodeAt(i));
    }
    return bytes    
}
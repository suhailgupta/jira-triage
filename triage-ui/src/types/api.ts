export interface StreamEvent {
    type: string
    text: string
}

export interface DiffFile {
    changes: string
}
import { useRef, useEffect } from "react";
import TextEditor from "../components/TextEditor";
import { MarkdownContent } from "../components/MarkdownContent";

export default function TestDividerPage() {
    const [content, setContent] = React.useState(`
    <p>Paragraph before divider.</p>
    <hr>
    <p>Paragraph after divider.</p>
  `);

    return (
        <div className="p-10 bg-gray-100 min-h-screen">
            <div className="bg-white p-10 rounded-3xl shadow-lg max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Divider Test</h1>

                <div className="mb-10">
                    <h2 className="text-xl font-bold mb-4">Editor</h2>
                    <TextEditor
                        label="Test Editor"
                        value={content}
                        onChange={setContent}
                    />
                </div>

                <div className="p-4 bg-gray-50 border rounded-xl">
                    <h2 className="text-xl font-bold mb-4">Preview (MarkdownContent)</h2>
                    <MarkdownContent content={content} />
                </div>
            </div>
        </div>
    );
}
import React from "react";

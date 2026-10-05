// Minimal, dependency-free markdown renderer for chat messages.
// Supports: headings, bold, italic, inline code, fenced code blocks,
// links, bullet/numbered lists and blockquotes. All text is HTML-escaped.
import React from 'react';

const escapeHtml = (str) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const INLINE_RE = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)\s]+)\))/g;

export const renderInline = (text, keyPrefix = '') => {
    const nodes = [];
    let lastIndex = 0;
    let match;
    let i = 0;
    const re = new RegExp(INLINE_RE.source, 'g');
    while ((match = re.exec(text)) !== null) {
        if (match.index > lastIndex) {
            nodes.push(
                <React.Fragment key={`${keyPrefix}-t${i}`}>
                    {text.slice(lastIndex, match.index)}
                </React.Fragment>
            );
            i += 1;
        }
        const [full, , bold, , ital, , code, , linkText, linkUrl] = match;
        const key = `${keyPrefix}-m${i}`;
        if (bold) nodes.push(<strong key={key}>{bold}</strong>);
        else if (ital) nodes.push(<em key={key}>{ital}</em>);
        else if (code) nodes.push(<code key={key}>{code}</code>);
        else if (linkText) {
            const safeUrl = linkUrl.startsWith('http') || linkUrl.startsWith('mailto:') ? linkUrl : `https://${linkUrl}`;
            nodes.push(
                <a key={key} href={safeUrl} target="_blank" rel="noreferrer noopener">
                    {linkText}
                </a>
            );
        }
        lastIndex = match.index + full.length;
        i += 1;
    }
    if (lastIndex < text.length) {
        nodes.push(
            <React.Fragment key={`${keyPrefix}-end`}>
                {text.slice(lastIndex)}
            </React.Fragment>
        );
    }
    return nodes.length ? nodes : text;
};

const splitBlocks = (text) => {
    const lines = text.split('\n');
    const blocks = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];

        const fence = line.match(/^```(\w*)/);
        if (fence) {
            const code = [];
            i += 1;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                code.push(lines[i]);
                i += 1;
            }
            i += 1;
            blocks.push({ type: 'code', lang: fence[1], content: code.join('\n') });
            continue;
        }

        const heading = line.match(/^(#{1,3})\s+(.*)/);
        if (heading) {
            blocks.push({ type: 'heading', level: heading[1].length, content: heading[2] });
            i += 1;
            continue;
        }

        const quote = line.match(/^>\s?(.*)/);
        if (quote) {
            blocks.push({ type: 'quote', content: quote[1] });
            i += 1;
            continue;
        }

        if (/^[-*]\s+/.test(line)) {
            const items = [];
            while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
                items.push(lines[i].replace(/^[-*]\s+/, ''));
                i += 1;
            }
            blocks.push({ type: 'ul', items });
            continue;
        }

        if (/^\d+[.)]\s+/.test(line)) {
            const items = [];
            while (i < lines.length && /^\d+[.)]\s+/.test(lines[i])) {
                items.push(lines[i].replace(/^\d+[.)]\s+/, ''));
                i += 1;
            }
            blocks.push({ type: 'ol', items });
            continue;
        }

        if (line.trim() === '') {
            i += 1;
            continue;
        }

        const para = [];
        while (
            i < lines.length &&
            lines[i].trim() !== '' &&
            !/^(```|#{1,3}\s|>\s?|[-*]\s|\d+[.)]\s)/.test(lines[i])
        ) {
            para.push(lines[i]);
            i += 1;
        }
        blocks.push({ type: 'p', content: para.join('\n') });
    }
    return blocks;
};

const blockStyle = {
    p: { margin: '0.4rem 0' },
    heading: (level) => ({
        margin: '0.9rem 0 0.45rem',
        fontWeight: 700,
        lineHeight: 1.3,
        fontSize: level === 1 ? '1.25rem' : level === 2 ? '1.1rem' : '1rem',
    }),
    quote: {
        margin: '0.5rem 0',
        paddingLeft: '0.9rem',
        borderLeft: '3px solid #DCD3C4',
        color: '#6F675C',
    },
    ul: { margin: '0.4rem 0', paddingLeft: '1.3rem' },
    ol: { margin: '0.4rem 0', paddingLeft: '1.3rem' },
    li: { margin: '0.18rem 0' },
    code: {
        display: 'block',
        overflowX: 'auto',
        margin: '0.6rem 0',
        padding: '0.8rem 1rem',
        borderRadius: 0,
        background: '#2B2620',
        color: '#F3EEE6',
        fontSize: '13px',
        lineHeight: 1.55,
        whiteSpace: 'pre',
        fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
    },
};

export const renderMarkdown = (text) => {
    const blocks = splitBlocks(text || '');
    return blocks.map((block, idx) => {
        const key = `md-${idx}`;
        switch (block.type) {
            case 'code':
                return (
                    <pre key={key} style={blockStyle.code}>
                        {escapeHtml(block.content)}
                    </pre>
                );
            case 'heading':
                return (
                    <div key={key} style={blockStyle.heading(block.level)}>
                        {renderInline(block.content, key)}
                    </div>
                );
            case 'quote':
                return (
                    <blockquote key={key} style={blockStyle.quote}>
                        {renderInline(block.content, key)}
                    </blockquote>
                );
            case 'ul':
                return (
                    <ul key={key} style={blockStyle.ul}>
                        {block.items.map((item, j) => (
                            <li key={`${key}-${j}`} style={blockStyle.li}>
                                {renderInline(item, `${key}-${j}`)}
                            </li>
                        ))}
                    </ul>
                );
            case 'ol':
                return (
                    <ol key={key} style={blockStyle.ol}>
                        {block.items.map((item, j) => (
                            <li key={`${key}-${j}`} style={blockStyle.li}>
                                {renderInline(item, `${key}-${j}`)}
                            </li>
                        ))}
                    </ol>
                );
            default:
                return (
                    <p key={key} style={blockStyle.p}>
                        {renderInline(block.content, key)}
                    </p>
                );
        }
    });
};

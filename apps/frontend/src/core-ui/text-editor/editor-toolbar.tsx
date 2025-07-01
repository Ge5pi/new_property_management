import { MouseEventHandler, useState } from 'react';
import { Button, ButtonGroup, Form, InputGroup, OverlayTrigger, Popover, Stack } from 'react-bootstrap';

import { Editor } from '@tiptap/react';

import { CustomSelect } from 'core-ui/custom-select';

declare type GenericMarkers =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'bulletList'
  | 'orderedList'
  | 'codeBlock'
  | 'blockquote'
  | 'code'
  | 'link';
declare type TextStyling = 1 | 2 | 3 | 4 | 5 | 6 | 'paragraph';
declare type TextAlignment = 'left' | 'right' | 'justify' | 'center';

interface EditorToolbarProps {
  editor: Editor;
  minified?: boolean;
  attachment?: {
    show: boolean;
    handle?: MouseEventHandler<HTMLButtonElement>;
  };
}
const EditorToolbar = ({ editor, minified, attachment }: EditorToolbarProps) => {
  const [link, setLink] = useState('');
  const [showLinkPopup, setLinkPopup] = useState(false);
  const [activeTextStyle, setTextStyle] = useState<TextStyling>('paragraph');

  const isGenericButtonActive = (mark: GenericMarkers) => {
    return editor.isActive(mark);
  };

  const isTextAlignmentActive = (mark: TextAlignment) => {
    return editor.isActive({ textAlign: mark });
  };

  const toggleTextFormatting = (mark: GenericMarkers) => {
    editor.chain().focus().toggleMark(mark).run();
  };

  const toggleTextAlignment = (mark: TextAlignment) => {
    editor.chain().focus().setTextAlign(mark).run();
  };

  const handleTextStyleChange = (value: string) => {
    const style = Number(value) > 0 ? (Number(value) as TextStyling) : 'paragraph';
    if (style === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: style }).run();
    }
    setTextStyle(style);
  };

  return (
    <Stack direction="horizontal" gap={1} className="flex-wrap p-1">
      {!minified && (
        <CustomSelect
          size="sm"
          name="TextStyling"
          disabled={!editor.isEditable}
          controlId="TextStylingDropdown"
          onSelectChange={value => handleTextStyleChange(value)}
          value={activeTextStyle}
          className="border-0"
          classNames={{
            wrapperClass: 'col-auto',
            selectClass: 'form-control-sm border-0 tiptap-select',
            menuItemClassName: 'tiptap-font-style-names',
          }}
          inputProps={{ tabIndex: -1, className: 'small border-0', style: { fontSize: 'small', border: 0 } }}
          autoFocus={false}
          options={[
            { value: 'paragraph', label: 'Normal' },
            { value: 1, label: 'Heading 01' },
            { value: 2, label: 'Heading 02' },
            { value: 3, label: 'Heading 03' },
            { value: 4, label: 'Heading 04' },
            { value: 5, label: 'Heading 05' },
            { value: 6, label: 'Heading 06' },
          ]}
        />
      )}
      <ButtonGroup aria-label="Text Formatting" className="tiptap-toggleButton" size="sm">
        <Button
          variant="secondary"
          tabIndex={-1}
          data-name="BOLD"
          active={isGenericButtonActive('bold')}
          onClick={() => toggleTextFormatting('bold')}
          disabled={!editor.isEditable}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z" />
          </svg>
        </Button>
        <Button
          variant="secondary"
          tabIndex={-1}
          data-name="ITALIC"
          active={isGenericButtonActive('italic')}
          onClick={() => toggleTextFormatting('italic')}
          disabled={!editor.isEditable}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z" />
          </svg>
        </Button>
        <Button
          variant="secondary"
          tabIndex={-1}
          data-name="UNDERLINE"
          active={isGenericButtonActive('underline')}
          onClick={() => toggleTextFormatting('underline')}
          disabled={!editor.isEditable}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z" />
          </svg>
        </Button>
        <Button
          variant="secondary"
          tabIndex={-1}
          data-name="STRIKETHROUGH"
          active={isGenericButtonActive('strike')}
          onClick={() => toggleTextFormatting('strike')}
          disabled={!editor.isEditable}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.8 2.8 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967" />
          </svg>
        </Button>
      </ButtonGroup>

      {!minified && (
        <ButtonGroup aria-label="Style Code" className="tiptap-toggleButton" size="sm">
          <Button
            variant="secondary"
            tabIndex={-1}
            data-name="CODE"
            active={isGenericButtonActive('code')}
            onClick={() => toggleTextFormatting('code')}
            disabled={!editor.isEditable}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8z" />
            </svg>
          </Button>
          <Button
            variant="secondary"
            tabIndex={-1}
            data-name="BLOCK CODE"
            active={isGenericButtonActive('codeBlock')}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={!editor.isEditable}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.212 2.737a.75.75 0 1 0-1.424-.474l-2.5 7.5a.75.75 0 0 0 1.424.474zm6.038.265a.75.75 0 0 0 0 1.5h2a.25.25 0 0 1 .25.25v11.5a.25.25 0 0 1-.25.25h-13a.25.25 0 0 1-.25-.25v-3.5a.75.75 0 0 0-1.5 0v3.5c0 .966.784 1.75 1.75 1.75h13a1.75 1.75 0 0 0 1.75-1.75v-11.5a1.75 1.75 0 0 0-1.75-1.75zm-3.69.5a.75.75 0 1 0-1.12.996l1.556 1.754-1.556 1.75a.75.75 0 1 0 1.12.997l2-2.249a.75.75 0 0 0 0-.996zM3.999 9.061a.75.75 0 0 1-1.058-.062l-2-2.249a.75.75 0 0 1 0-.996l2-2.252a.75.75 0 1 1 1.12.996L2.504 6.252l1.557 1.75a.75.75 0 0 1-.062 1.059"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </ButtonGroup>
      )}

      {!minified && (
        <ButtonGroup aria-label="Text Align" className="tiptap-toggleButton" size="sm">
          <Button
            variant="secondary"
            tabIndex={-1}
            data-name="LEFT"
            active={isTextAlignmentActive('left')}
            onClick={() => toggleTextAlignment('left')}
            disabled={!editor.isEditable}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </Button>
          <Button
            variant="secondary"
            tabIndex={-1}
            data-name="CENTER"
            active={isTextAlignmentActive('center')}
            onClick={() => toggleTextAlignment('center')}
            disabled={!editor.isEditable}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </Button>
          <Button
            variant="secondary"
            tabIndex={-1}
            data-name="RIGHT"
            active={isTextAlignmentActive('right')}
            onClick={() => toggleTextAlignment('right')}
            disabled={!editor.isEditable}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </Button>
          <Button
            variant="secondary"
            tabIndex={-1}
            data-name="JUSTIFY"
            active={isTextAlignmentActive('justify')}
            onClick={() => toggleTextAlignment('justify')}
            disabled={!editor.isEditable}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </Button>
        </ButtonGroup>
      )}

      {!minified && (
        <ButtonGroup aria-label="Ordered Unordered List" className="tiptap-toggleButton" size="sm">
          <Button
            variant="secondary"
            tabIndex={-1}
            data-name="UNORDERED"
            active={isGenericButtonActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={!editor.isEditable}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
              />
            </svg>
          </Button>
          <Button
            variant="secondary"
            tabIndex={-1}
            data-name="ORDERED"
            active={isGenericButtonActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={!editor.isEditable}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"
              />
              <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635z" />
            </svg>
          </Button>
        </ButtonGroup>
      )}
      {!minified && (
        <ButtonGroup aria-label="Link & Unlink URLs" className="tiptap-toggleButton" size="sm">
          <Button
            variant="secondary"
            tabIndex={-1}
            data-name="BLOCKQUOTE"
            active={isGenericButtonActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={!editor.isEditable}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388q0-.527.062-1.054.093-.558.31-.992t.559-.683q.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 9 7.558V11a1 1 0 0 0 1 1zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612q0-.527.062-1.054.094-.558.31-.992.217-.434.559-.683.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 3 7.558V11a1 1 0 0 0 1 1z" />
            </svg>
          </Button>
          <OverlayTrigger
            flip
            rootClose
            trigger="click"
            show={showLinkPopup}
            onToggle={next => {
              if (editor.view.state.selection.empty || editor.isActive('link')) {
                setLinkPopup(false);
                if (editor.isActive('link')) {
                  editor.chain().focus().unsetLink().run();
                }
              } else {
                setLinkPopup(next);
              }
            }}
            overlay={overlayProps => (
              <Popover {...overlayProps} id={`link-popover`}>
                <Popover.Body>
                  <Form.Group controlId="tiptap-url">
                    <Form.Label className="form-label-sm">Enter Link</Form.Label>
                    <InputGroup className="mb-3" size="sm">
                      <Form.Control
                        aria-describedby="add-tiptap-url"
                        value={link}
                        onChange={ev => setLink(ev.target.value)}
                      />
                      <Button
                        variant="primary"
                        id="add-tiptap-url"
                        onClick={() => {
                          if (!link) return;
                          editor
                            .chain()
                            .focus()
                            .extendMarkRange('link')
                            .setLink({ href: link.startsWith('https') ? link : `https://${link}`, target: '_blank' })
                            .run();
                          setLinkPopup(false);
                          setLink('');
                        }}
                      >
                        Add
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Popover.Body>
              </Popover>
            )}
          >
            <Button
              size="sm"
              variant="secondary"
              tabIndex={-1}
              data-name="LINK-UNLINK"
              active={isGenericButtonActive('link')}
              disabled={!editor.isEditable}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
              </svg>
            </Button>
          </OverlayTrigger>
        </ButtonGroup>
      )}
      {!minified && attachment && attachment.show && (
        <Button
          className="tiptap-toggleButton"
          size="sm"
          variant="secondary"
          tabIndex={-1}
          data-name="ATTACHMENTS"
          onClick={attachment.handle}
          disabled={!editor.isEditable}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
          </svg>
        </Button>
      )}
    </Stack>
  );
};

export default EditorToolbar;

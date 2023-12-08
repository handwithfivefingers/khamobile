
const EDITOR_PLUG = [
  'autoresize',
  'preview',
  'searchreplace',
  'autolink',
  'save',
  'code',
  'visualblocks',
  'iframe',
  // 'visualchars',
  'toc',
  'fullscreen',
  'image',
  'link',
  'media',
  'template',
  'codesample',
  'table',
  // 'charmap',
  'pagebreak',
  'nonbreaking',
  'anchor',
  'insertdatetime',
  'advlist',
  'lists',
  // 'wordcount',
  'help',
  'quickbars',
  'emoticons',
]

const EDITOR_TOOLBARS =
  'undo redo | blocks | iframe image media | bullist numlist outdent indent | code codesample toc '

const CLASSIC = {
  height: 500,
  plugins: EDITOR_PLUG,
  toolbar: EDITOR_TOOLBARS,
  menubar: 'file edit view insert format tools table help',
  quickbars_selection_toolbar:
    'bold italic forecolor | alignleft aligncenter alignright alignjustify | blocks |  removeformat',
  toolbar_sticky: true,
  content_css: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',
  content_style: `
    body { 
      font-size:16px;
      font-family:Helvetica,Arial,sans-serif;
      margin:12px;
    }`,
  image_advtab: true,
  image_uploadtab: true,
  
  codesample_languages: [
    { text: 'HTML/XML', value: 'markup' },
    { text: 'JavaScript', value: 'javascript' },
    { text: 'CSS', value: 'css' },
    { text: 'React - JSX', value: 'jsx' },
    { text: 'React - TSX', value: 'tsx' },
  ],
  extended_valid_elements:
    'iframe[src|frameborder|style|scrolling|class|width|height|name|align|title|loading|allowtransparency|allowfullscreen]',
}

const INLINE = {
  menubar: false,
  inline: true,
  plugins: [
    'autolink',
    'codesample',
    'link',
    'lists',
    'media',
    // 'powerpaste',
    'table',
    'image',
    'quickbars',
    'codesample',
    'help',
  ],
  toolbar: false,
  quickbars_insert_toolbar: 'quicktable image media codesample',
  quickbars_selection_toolbar: 'bold italic underline | blocks | blockquote quicklink',
  contextmenu: 'undo redo | inserttable | cell row column deletetable | help',
}

const TINY_MCE_CONFIGS = {
  classic: CLASSIC,
  free_inline: INLINE,
}

export { TINY_MCE_CONFIGS }

" Set 'nocompatible' to ward off unexpected things that your distro might
" have made, as well as sanely reset options when re-sourcing .vimrc
set nocompatible


" pathogen runtime/plugin management https://github.com/tpope/vim-pathogen
execute pathogen#infect()
syntax on
filetype indent on      " load filetype-specific indent files
filetype plugin on       " used for plugins like NERD commenter to comment out lines according to file type https://github.com/scrooloose/nerdcommenter

set t_Co=256
"colorscheme kolor
set background=light
let g:gruvbox_filetype_hi_groups = 1
let g:gruvbox_italics = 1
let g:gruvbox_italicize_strings = 1
let g:gruvbox_transp_bg = 0
colorscheme gruvbox8


" WHITESPACE
set tabstop=4       " number of visual spaces per TAB
set softtabstop=4   " number of spaces in tab when editing
set expandtab       " tabs are spaces
set number          " show line numbers
set list            " show whitespace
set listchars=eol:¬,tab:>·,trail:~,extends:>,precedes:<,space:·    " show ALL whitespace

set cursorline	        " highlight current line
set wildmenu            " visual autocomplete for command menu
set lazyredraw          " redraw only when we need to.
set showmatch           " highlight matching [{()}]
set incsearch           " search as characters are entered
set hlsearch            " highlight matches
set ignorecase          " Case insensitive search except when using capitals
set smartcase
set clipboard=unnamed


" When opening a new line and no filetype-specific indenting is enabled, keep
" the same indent as the line you're currently on. Useful for READMEs, etc.
set autoindent
 
" Stop certain movements from always going to the first character of a line.
" While this behaviour deviates from that of Vi, it does what most users
" coming from other editors would expect.
set nostartofline

" Use visual bell instead of beeping when doing something wrong
set visualbell

" turn off search highlight
nnoremap <leader><space> :nohlsearch<CR>
" toggle gundo
nnoremap <leader>u :GundoToggle<CR>
" Enable mouse use in all modes
set mouse=a

" NERDTree Config
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") | NERDTree | endif
let NERDTreeShowHidden=1
map <C-_> :NERDTreeToggle<CR>


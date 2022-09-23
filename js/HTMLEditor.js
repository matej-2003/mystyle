class HTMLEditor {
	constructor() {
		this.MODE = 'html';
		this.editor = $("<div></div>").addClass("html_editor");
		this.code_textarea = $("<textarea></textarea>").addClass("code_textarea").hide();

		// BODY
		this.html = $('<div></div>').attr({'class': 'editor'});
		this.html.append(this.editor);

		this.toolbar = $('<div></div>').attr({'class': 'toolbar'});
		this.toolbar2 = $('<div></div>').attr({'class': 'toolbar2'});
		this.textbox = $('<div></div>').attr({'class': 'textbox', 'contenteditable': 'true'});

		this.editor.append(
			this.toolbar2,
			this.toolbar,
			this.textbox,
			this.code_textarea,
		);

		this.styles = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre'];
		this.style = $('<select></select>').append(
			$('<option>-style-</option>').attr({'selected': ''})
		);
		for (let i of this.styles) {
			this.style.append(
				$(`<option>${i}</option>`).attr({'value': i})
			);
		}

		this.font = $('<select></select>').append(
			$('<option>-font-</option>').attr({'selected': ''})
		);
		for (let i of fonts) {
			this.font.append(
				$(`<option>${i}</option>`)
				.attr({'value': i})
				.css({'font-family': i})
			);
		}

		this.sizes = [
			['Very small', 0],
			['Small', 1],
			['Normal', 2],
			['Medium', 3],
			['Big', 4],
			['Very big', 5],
			['Maximum', 6],
		];

		this.size = $('<select></select>').append($('<option>-size-</option>').attr({'selected': ''}));
		for (let i of this.sizes) {
			this.size.append($(`<option>${i[0]}</option>`).attr({'value': i[1]}));
		}

		this.colors = [
			'red',
			'green',
			'blue',
			'black',
			'gray',
			'white',
			'silver',
			'maroon',
			'yellow',
			'olive',
			'lime',
			'aqua',
			'teal',
			'navy',
			'fuchsia',
			'purple'
		];

		this.fg_color_selection = $('<select></select>').append(
			$('<option>-color-</option>').attr({'selected': ''})
		);

		for (let i of this.colors) {
			this.fg_color_selection.append(
				$(`<option>${i}</option>`).attr({'value': i}).css({'color': i})
			);
		}
		this.fg_color = $('<input>', {'type': 'color'});


		this.bg_color_selection = $('<select></select>').append(
			$('<option>-color-</option>').attr({'selected': ''})
		);

		for (let i of this.colors) {
			this.bg_color_selection.append(
				$(`<option>${i}</option>`).attr({'value': i}).css({'background-color': i})
			);
		}
		this.bg_color = $('<input>', {'type': 'color'});

		this.toolbar2.append(
			this.style,
			this.font,
			'Size:',
			this.size,
			'Fg: ',
			this.fg_color,
			this.fg_color_selection,
			'Bg:',
			this.bg_color,
			this.bg_color_selection,
		);

		// toolbar

		this.group1             = $('<div></div>').addClass('btn-group');
		this.clear              = $('<a></a>').attr({'href': '#', 'title': 'Clear'}).addClass('btn noshadow icon clear');
		this.undo               = $('<a></a>').attr({'href': '#', 'title': 'Rndo'}).addClass('btn noshadow icon undo');
		this.redo               = $('<a></a>').attr({'href': '#', 'title': 'Redo'}).addClass('btn noshadow icon redo');
		this.remove_formatting  = $('<a></a>').attr({'href': '#', 'title': 'Remove formatting'}).addClass('btn noshadow icon remove_formatting');
		this.group1.append(
			this.clear,
			this.undo,
			this.redo,
			this.remove_formatting,
		);

		this.group2             = $('<div></div>').addClass('btn-group');
		this.bold               = $('<a></a>').attr({'href': '#', 'title': 'Bold'}).addClass('btn noshadow icon bold');
		this.italic             = $('<a></a>').attr({'href': '#', 'title': 'Italic'}).addClass('btn noshadow icon italic');
		this.underline          = $('<a></a>').attr({'href': '#', 'title': 'Underline'}).addClass('btn noshadow icon underline');
		this.strike_through     = $('<a></a>').attr({'href': '#', 'title': 'Strike through'}).addClass('btn noshadow icon strike_through');
		this.subscript          = $('<a></a>').attr({'href': '#', 'title': 'Sub script'}).addClass('btn noshadow icon subscript');
		this.superscript        = $('<a></a>').attr({'href': '#', 'title': 'Super script'}).addClass('btn noshadow icon superscript');
		this.group2.append(
			this.bold,
			this.italic,
			this.underline,
			this.strike_through,
			this.subscript,
			this.superscript,
		);

		this.group3             = $('<div></div>').addClass('btn-group');
		this.left_align         = $('<a></a>').attr({'href': '#', 'title': 'Left align'}).addClass('btn noshadow icon left_align');
		this.center_align       = $('<a></a>').attr({'href': '#', 'title': 'Center align'}).addClass('btn noshadow icon center_align');
		this.right_align        = $('<a></a>').attr({'href': '#', 'title': 'Right align'}).addClass('btn noshadow icon right_align');
		this.group3.append(
			this.left_align,
			this.center_align,
			this.right_align,
		);

		this.group4             = $('<div></div>').addClass('btn-group');
		this.numbered_list      = $('<a></a>').attr({'href': '#', 'title': 'Numbered list'}).addClass('btn noshadow icon numbered_list');
		this.dotted_list        = $('<a></a>').attr({'href': '#', 'title': 'Dotted list'}).addClass('btn noshadow icon dotted_list');
		this.quota              = $('<a></a>').attr({'href': '#', 'title': 'Quota'}).addClass('btn noshadow icon quota');
		this.delete_indentation = $('<a></a>').attr({'href': '#', 'title': 'Delete indentation'}).addClass('btn noshadow icon delete_indentation');
		this.add_indentation    = $('<a></a>').attr({'href': '#', 'title': 'Add indentation'}).addClass('btn noshadow icon add_indentation');
		this.group4.append(
			this.numbered_list,
			this.dotted_list,
			this.quota,
			this.delete_indentation,
			this.add_indentation,
		);

		this.group5             = $('<div></div>').addClass('btn-group');
		this.hyperlink          = $('<a></a>').attr({'href': '#', 'title': 'Hyperlink'}).addClass('btn noshadow icon hyperlink');
		this.insert_image       = $('<a></a>').attr({'href': '#', 'title': 'Insert image'}).addClass('btn noshadow icon image_insert');
		this.cut                = $('<a></a>').attr({'href': '#', 'title': 'Cut'}).addClass('btn noshadow icon cut');
		this.copy               = $('<a></a>').attr({'href': '#', 'title': 'Copy'}).addClass('btn noshadow icon copy');
		this.paste              = $('<a></a>').attr({'href': '#', 'title': 'Paste'}).addClass('btn noshadow icon paste');
		this.html_code          = $('<a></a>').attr({'href': '#', 'title': 'HTML code'}).addClass('btn noshadow icon html_code');
		this.group5.append(
			this.hyperlink,
			this.insert_image,
			this.cut,
			this.copy,
			this.paste,
			this.html_code,
		);

		this.toolbar.append(
			this.group1,
			this.group2,
			this.group3,
			this.group4,
			this.group5,
		);

		this.clear.click(() => { this.format('delete')});
		this.undo.click(() => { this.format('undo')});
		this.redo.click(() => { this.format('redo')});
		this.remove_formatting.click(() => { this.format('removeFormat')});

		this.bold.click(() => { this.format('bold')});
		this.italic.click(() => { this.format('italic')});
		this.underline.click(() => { this.format('underline')});
		this.strike_through.click(() => { this.format('strikethrough')});
		this.subscript.click(() => { this.format('subscript')});
		this.superscript.click(() => { this.format('superscript')});

		this.left_align.click(() => { this.format('justifyleft')});
		this.center_align.click(() => { this.format('justifycenter')});
		this.right_align.click(() => { this.format('justifyright')});

		this.numbered_list.click(() => { this.format('insertorderedlist')});
		this.dotted_list.click(() => { this.format('insertunorderedlist')});
		this.quota.click(() => { this.format('formatblock', 'blockquote')});
		this.delete_indentation.click(() => { this.format('outdent')});
		this.add_indentation.click(() => { this.format('indent')});

		this.hyperlink.click(() => {
			if (this.MODE == 'html') {
				let link = prompt('Write the URL here', 'http:\/\/');
				if (link && link != '' && link != `http://`) {
					this.format('createlink', link)
				}
			}
		});
		this.insert_image.click(() => {
			if (this.MODE == 'html') this.img_editor_modal.start();
		});
		this.cut.click(() => { this.format('cut')});
		this.copy.click(() => { this.format('copy')});
		this.paste.click(() => { this.format('paste')});
		this.html_code.click(() => {
			if (this.MODE == 'html') {
				this.disable();
			} else {
				this.enable();
			}
		});

		this.style.change(() => {
			if (this.MODE == 'html') {
				this.format('formatblock', this.style[0][this.style[0].selectedIndex].value);
				// this.style.selectedIndex = 0;
			}
		});
		this.font.change(() => {
			if (this.MODE == 'html') {
				this.format('fontname', this.font[0][this.font[0].selectedIndex].value);
				// this.font.selectedIndex = 0;
			}
		});
		this.size.change(() => {
			if (this.MODE == 'html') {
				this.format('fontsize', this.size[0][this.size[0].selectedIndex].value);
				// this.size.selectedIndex = 0;
			}
		});
		this.fg_color_selection.change(() => {
			if (this.MODE == 'html') {
				this.format('forecolor', this.fg_color_selection[0][this.fg_color_selection[0].selectedIndex].value);
				// this.fg_color_selection.selectedIndex = 0;
			}
		});
		// this.fg_color.change(() => { this.format('forecolor', this.fg_color.value)});

		this.bg_color_selection.change(() => {
			if (this.MODE == 'html') {
				this.format('backcolor', this.bg_color_selection[0][this.bg_color_selection[0].selectedIndex].value);
				// this.bg_color_selection.selectedIndex = 0;
			}
		});
		// this.bg_color.change(() => { this.format('backcolor', this.bg_color.value)});

		document.execCommand('enableAbsolutePositionEditor', true, true);

	}

	disable() {
		this.MODE                        = 'code';
		this.style.disabled              = true;
		this.font.disabled               = true;
		this.size.disabled               = true;
		this.fg_color.disabled           = true;
		this.fg_color_selection.disabled = true;
		this.bg_color.disabled           = true;
		this.bg_color_selection.disabled = true;

		this.toolbar.classList.add('disabled');
		this.toolbar2.classList.add('disabled');

		this.start_code_editor();
	}

	enable() {
		this.MODE                        = 'html';
		this.style.disabled              = false;
		this.font.disabled               = false;
		this.size.disabled               = false;
		this.fg_color.disabled           = false;
		this.fg_color_selection.disabled = false;
		this.bg_color.disabled           = false;
		this.bg_color_selection.disabled = false;

		this.toolbar.classList.remove('disabled');
		this.toolbar2.classList.remove('disabled');

		this.start_html_editor();
	}

	start_code_editor() {
		this.code_textarea.style.display = 'block';
		this.textbox.style.display = 'none';

		let code = this.textbox.innerHTML;
		this.code_textarea.value = code;
	}

	start_html_editor() {
		this.code_textarea.style.display = 'none';
		this.textbox.style.display = 'block';

		let code = this.code_textarea.value;
		this.textbox.innerHTML = code;
	}

	format(sCmd, sValue) {
		if (this.MODE == 'html') {
			document.execCommand(sCmd, false, sValue);
			this.textbox.focus();
		}
		document.execCommand('enableObjectResizing', true, true);
		document.execCommand('enableAbsolutePositionEditor', true, true);
	}

	get_content() {
		let content = pack_element(this.textbox);
		delete content['attributes'];
		delete content['class'];
		return content;
	}
}
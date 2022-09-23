class HTMLEditor {
	constructor(...args) {
		this.MODE = 'html';
		this.editor = $('<div></div>').addClass('html_editor');
		this.code_textarea = $('<textarea></textarea>').addClass('code_textarea').hide();

		this.link_input = $('<input>').attr({'type': 'text'}).val('http:\/\/');
		this.link_modal = new Modal(null, null, null, this.add_link(this));
		this.link_modal.modal_body.append(
			'Enter Link: ',
			$('<br>'),
			this.link_input,
		);
		this.image_editor = new ImageEditor(true, this.insert_image(this), ...args);
		this.image_editor_modal = new Modal(this.image_editor.html, null, null, () => null);

		this.symbol_selector = new InsertSpecial(this.insert_symbol(this));
		this.symbol_selector_modal = new Modal(this.symbol_selector.html, null, null, () => null);

		// BODY
		this.html = $('<div></div>').attr({ 'class': 'editor' });
		this.html.append(this.editor);

		this.toolbar = $('<div></div>').attr({ 'class': 'toolbar' });
		this.toolbar2 = $('<div></div>').attr({ 'class': 'toolbar' });
		this.textbox = $('<div></div>').attr({ 'class': 'textbox', 'contenteditable': 'true' });
		this.ism = $('<div></div>').attr({ 'class': 'image_settings_modals'});

		this.editor.append(
			this.toolbar,
			this.toolbar2,
			this.textbox,
			this.code_textarea,
			this.link_modal.modal,
			this.image_editor_modal.modal,
			this.symbol_selector_modal.modal,
			this.ism,
		);

		let _fonts = fonts.map((f) => {return [f, f, {'font-family': f}]});

		this.colors = ['red', 'green', 'blue', 'black', 'gray', 'white', 'silver', 'maroon', 'yellow', 'olive', 'lime', 'aqua', 'teal', 'navy', 'fuchsia', 'purple'];
		let _fg_colors = this.colors.map((c) => {return [c, c, {'color': c}]});
		let _bg_colors = this.colors.map((c) => {return [c, c, {'background-color': c}]});

		this.fg_color_input = $('<input>', { 'type': 'color' });
		this.bg_color_input = $('<input>', { 'type': 'color' });

		const toolbar_layout = [
			{
				'name': 'style',
				'options': [
					['h1', 'h1', {}],
					['h2', 'h2', {}],
					['h3', 'h3', {}],
					['h4', 'h4', {}],
					['h5', 'h5', {}],
					['h6', 'h6', {}],
					['p', 'p', {}],
					['pre', 'pre', {}],
				],
				'fun': 'formatblock',
			},
			{
				'name': 'fonts',
				'options': _fonts,
				'fun': 'fontname',
			},
			{
				'name': 'size',
				'options': [
					['Very small', 0, {}],
					['Small', 1, {}],
					['Normal', 2, {}],
					['Medium', 3, {}],
					['Big', 4, {}],
					['Very big', 5, {}],
					['Maximum', 6, {}],
				],
				'fun': 'fontsize',
			},
			{
				'label': 'Fg: ',
				'name': 'fg colors',
				'options': _fg_colors,
				'fun': 'forecolor',
			},
			{
				'label': 'Bg: ',
				'name': 'bg colors',
				'options': _bg_colors,
				'fun': 'backcolor',
			},
		];


		for (let _selection of toolbar_layout) {
			if (_selection['label']) this.toolbar.append(_selection['label']);

			let selection = $(`<select>${_selection}</select>`);
			selection.append($(`<option>--${_selection['name']}--</option>`));

			for (let _opt of _selection['options']) {
				selection.append($(`<option>${_opt[0]}</option>`).attr({ 'value': _opt[1] }).css(_opt[2]));
			}
			selection.change(() => {
				if (this.MODE == 'html') {
					this.format(_selection['fun'], selection[0][selection[0].selectedIndex].value);
					selection.selectedIndex = 0;
				}
			});
			this.toolbar.append(selection);
		}

		const toolbar2_layout = [
			[
				['Clear', '../images/icons/page_white_delete.png', () => { this.format('delete'); this.ism.html('') }],
				['Rndo', '../images/icons/arrow_undo.png', () => { this.format('undo') }],
				['Redo', '../images/icons/arrow_redo.png', () => { this.format('redo') }],
				['Remove formatting', '../images/icons/font_delete.png', () => { this.format('removeFormat') }],
			],
			[
				['Bold', '../images/icons/text_bold.png', () => { this.format('bold') }],
				['Italic', '../images/icons/text_italic.png', () => { this.format('italic') }],
				['Underline', '../images/icons/text_underline.png', () => { this.format('underline') }],
				['Strike through', '../images/icons/text_strikethrough.png', () => { this.format('strikethrough') }],
				['Sub script', '../images/icons/text_subscript.png', () => { this.format('subscript') }],
				['Super script', '../images/icons/text_superscript.png', () => { this.format('superscript') }],
			],
			[
				['Left align', '../images/icons/text_align_left.png', () => { this.format('justifyleft') }],
				['Center align', '../images/icons/text_align_center.png', () => { this.format('justifycenter') }],
				['Right align', '../images/icons/text_align_right.png', () => { this.format('justifyright') }],
				['Dotted list', '../images/icons/text_list_bullets.png', () => { this.format('insertunorderedlist') }],
				['Numbered list', '../images/icons/text_list_numbers.png', () => { this.format('insertorderedlist') }],
				['Add indentation', '../images/icons/text_indent.png', () => { this.format('indent') }],
				['Delete indentation', '../images/icons/text_indent_remove.png', () => { this.format('outdent') }],
			],
			[
				['Cut', '../images/icons/cut.png', () => { this.format('cut') }],
				['Copy', '../images/icons/page_copy.png', () => { this.format('copy') }],
				['Paste', '../images/icons/paste_plain.png', () => { this.format('paste') }],
			]
		];


		for (let _btngrp of toolbar2_layout) {
			let btngrp = $('<div></div>').addClass('btn-group');
			for (let _btn of _btngrp) {
				let btn = $('<a></a>').attr({ 'href': '#', 'title': _btn[0] }).addClass('btn').append($('<img>').attr('src', _btn[1]));
				btn.click(_btn[2]);
				btngrp.append(btn);
			}
			this.toolbar2.append(btngrp);
		}


		let btngrp = $('<div></div>').addClass('btn-group');

		this.link_btn = $('<a></a>').attr({ 'href': '#', 'title': 'Insert link' }).addClass('btn').append($('<img>').attr('src', '../images/icons/link.png'));
		this.symbol_selector_btn = $('<a></a>').attr({ 'href': '#', 'title': 'Insert symbol' }).addClass('btn').append($('<img>').attr('src', '../images/icons/text_letter_omega.png'));
		this.image_btn = $('<a></a>').attr({ 'href': '#', 'title': 'Insert image' }).addClass('btn').append($('<img>').attr('src', '../images/icons/insert_image.png'));
		this.html_btn = $('<a></a>').attr({ 'href': '#', 'title': 'HTML' }).addClass('btn html').append($('<img>').attr('src', '../images/icons/page_white_code.png'));
		
		btngrp.append(
			this.link_btn,
			this.image_btn,
			this.symbol_selector_btn,
			this.html_btn
		);
		this.toolbar2.append(btngrp);


		this.html_btn.click(() => {
			if (this.MODE == 'html') {
				this.disable();
			} else {
				this.enable();
			}
		});

		this.symbol_selector_btn.click(() => {
			if (this.MODE == 'html') this.symbol_selector_modal.start();
		});

		this.link_btn.click(() => {
			this.link_modal.start();
		});

		this.image_btn.click(() => {
			if (this.MODE == 'html') this.image_editor_modal.start();
		});
		

		document.execCommand('enableAbsolutePositionEditor', true, true);

	}

	add_link(editor) {
		return () => {
			let link = editor.link_input.val();
			if (link && link != '' && link != `http://`) {
				editor.format('createlink', link);
				editor.format('createlink', link);
			}
			editor.link_input.val('http:\/\/');
		}
	}

	disable() {
		this.MODE = 'code';
		this.toolbar2.find('a.btn').addClass('disabled');
		this.html_btn.removeClass('disabled');
		this.html_btn.addClass('active');

		this.toolbar.children().prop('disabled', true);
		this.toolbar.addClass('disabled');
		this.toolbar2.addClass('disabled');

		this.start_code_editor();
	}

	enable() {
		this.MODE = 'html';
		this.toolbar2.find('a.btn').removeClass('disabled');
		this.html_btn.removeClass('active');

		this.toolbar.children().prop('disabled', false);
		this.toolbar.removeClass('disabled');
		this.toolbar2.removeClass('disabled');

		this.start_html_editor();
	}

	start_code_editor() {
		this.code_textarea.show();
		this.textbox.hide();

		this.code_textarea.val(this.textbox.html());
	}

	start_html_editor() {
		this.code_textarea.hide();
		this.textbox.show();

		this.textbox.html(this.code_textarea.val());
	}

	format(sCmd, sValue) {
		if (this.MODE == 'html') {
			document.execCommand(sCmd, false, sValue);
			this.textbox.focus();
		}
		document.execCommand('enableObjectResizing', true, true);
		document.execCommand('enableAbsolutePositionEditor', true, true);
	}

	insert_image(html_editor) {
		return () => {
			let ei = new ImageSettings(html_editor.image_editor.get_image());
			html_editor.ism.append(ei.image_editor_modal.modal);
			html_editor.textbox.append(ei.image);

			html_editor.image_editor_modal.stop();
			html_editor.image_editor.reset();
		}
	}

	insert_symbol(html_editor) {
		return () => {
			html_editor.textbox.append(html_editor.symbol_selector.get_symbol());
			html_editor.symbol_selector_modal.stop();
			html_editor.symbol_selector.reset();
		}
	}
}
let fonts = [
	'Blackadder ITC',
	'Agency FB',
	'Bauhaus 93',
	'Bradley Hand ITC',
	'Broadway',
	'Bodoni MT Poster Compressed',
	'Castellar',
	'Chiller',
	'Comic Sans MS',
	'Curlz MT',
	'Brush Script MT',
	'Edwardian Script ITC',
	'Footlight MT Light',
	'Freestyle Script',
	'French Script MT',
	'Gigi',
	'Forte',
	'Gill Sans MT Ext Condensed Bold',
	'Haettenschweiler',
	'Informal Roman',
	'Ink Free',
	'Jokerman',
	'Juice ITC',
	'Kunstler Script',
	'Liberation Mono',
	'Magneto',
	'Matura MT Script Capitals',
	'Mistral',
	'Vladimir Script',
	'Vivaldi',
	'Stencil',
	'Playbill',
	'American Typewriter',
	'Andale Mono',
	'Arial',
	'Arial Black',
	'Arial Narrow',
	'Arial Rounded MT Bold',
	'Arial Unicode MS',
	'Avenir',
	'Avenir Next',
	'Avenir Next Condensed',
	'Baskerville',
	'Big Caslon',
	'Bodoni 72',
	'Bodoni 72 Oldstyle',
	'Bodoni 72 Smallcaps',
	'Bradley Hand',
	'Brush Script MT',
	'Chalkboard',
	'Chalkboard SE',
	'Chalkduster',
	'Charter',
	'Cochin',
	'Comic Sans MS',
	'Copperplate',
	'Courier',
	'Courier New',
	'Didot',
	'DIN Alternate',
	'DIN Condensed',
	'Futura',
	'Garamond',
	'Geneva',
	'Georgia',
	'Gill Sans',
	'Helvetica',
	'Helvetica Neue',
	'Herculanum',
	'Hoefler Text',
	'Impact',
	'Lucida Grande',
	'Lucida Console',
	'Lucida Handwriting',
	'Luminari',
	'Marker Felt',
	'Menlo',
	'Microsoft Sans Serif',
	'Monaco',
	'Noteworthy',
	'Optima',
	'Palatino',
	'Papyrus',
	'Phosphate',
	'Rockwell',
	'Savoye LET',
	'SignPainter',
	'Skia',
	'Snell Roundhand',
	'Tahoma',
	'Times',
	'Times New Roman',
	'Trattatello',
	'Trebuchet MS',
	'Verdana',
	'Zapfino'
];

class Modal {
	constructor(content, header, footer, onclose=null) {
		this.modal         = $('<div></div>').addClass('modal');
		this.modal_content = $('<div></div>').addClass('modal_content');
		this.open_btn      = $('<button>Open modal</button>');
		this.close_btn     = $('<span>&times;</span>').addClass('modal_close');
		this.modal_content.append(this.close_btn, $('<br>'));
		this.modal_body = $('<div></div>').addClass('modal_body');
		this.modal.append(this.modal_content);

		if (header) {
			this.modal_content.append($('<div></div>').addClass('modal_header').append(header));
		}
		this.modal_content.append(this.modal_body);
		if (content) {
			this.modal_body.append(content);
		}
		if (footer) {
			this.modal_content.append($('<div></div>').addClass('modal_footer').append(header));
		}

		this.close_btn.click(() => {
			this.modal.hide();
			if (onclose) onclose();
		});

		this.modal.click((event) => {
			if (event.target == this.modal[0] && event.target != this.modal_content) {
				this.modal.hide();
				if (onclose) onclose();
			}
		});
		this.open_btn.click(() => {
			this.start();
		});
	}
	start() {
		this.modal.show();
	}

	stop() {
		this.modal.hide();
	}
}

class MultipleSelect {
	constructor(left_values=[], right_values=[], left_header="Left", right_header="Right") {
		this.left_btn     = $("<button>&gt;&gt;</button>").addClass("left btn").attr({"title": "Move to the left"});
		this.right_btn    = $("<button>&lt;&lt;</button>").addClass("right btn").attr({"title": "Move to the right"});
		this.left_select  = $("<select></select>").attr({"multiple": 0, "title": left_header}).addClass("left");
		this.right_select = $("<select></select>").attr({"multiple": 0, "title": right_header}).addClass("right");
		this._select      = $("<select></select>").attr({"multiple": 0}).hide()[0];

		this.html = $("<div></div>").addClass("multiple_selector").append(
			$(`<span>${left_header}</span>`),
			$("<span></span>"),
			$(`<span>${right_header}</span>`),
			this.left_select,
			$("<div></div>").addClass("buttons").append(
				this.left_btn,
				this.right_btn,
			),
			this.right_select,
			this._select,
		);

		if (left_values) {
			for (let opt of left_values) {
				this.select_append(this.left_select, opt);
			}
		}

		if (right_values) {
			for (let opt of right_values) {
				this.select_append(this.right_select, opt);
			}
		}

		this.left_btn.click(() => {
			this.right_select.append(this.left_select[0].selectedOptions);
			this.reset();
		});

		this.right_btn.click(() => {
			this.left_select.append(this.right_select[0].selectedOptions);
			this.reset();
		});

		this.reset();
	};

	set_selection(s) {
		this._select = s;
		this.reset();
	}

	reset() {
		for (let opt of this.left_select[0].options) opt.selected = false;
		for (let opt of this.right_select[0].options) opt.selected = false;

		let l = this._select.options.length;
		for (let i=0; i<l; i++) {
			this._select.remove(0);
		}

		let right_options = this.right_select[0].options;
		for (let i=0; i<right_options.length; i++) {
			let sopt = right_options[i].cloneNode(true);
			sopt.selected = true;
			this._select.append(sopt);
		}
	}

	select_append(selection, opt) {
		if (typeof(opt) == 'string') {
			selection.append($(`<option>${opt}</option>`))
		}
		else {
			selection.append(opt)
		}
	}
}

class Row {
	constructor(row, checkbox) {
		this.row      = row;
		this.checkbox = checkbox;
		this.on_click = null;

		if (this.checkbox.prop('checked')) this.row.toggleClass('selected');

		this.checkbox.click(() => {
			this.toggle_checkbox();
			if (this.checkbox.prop('checked')) this.row.addClass('selected');
			else this.row.removeClass('selected');
			if (this.on_click) this.on_click();
		});

		this.row.click(() => {
			if (this.checkbox) {
				this.toggle_checkbox();
				if (this.on_click) this.on_click();
			}
			this.row.toggleClass('selected');
		});
	}

	toggle_checkbox() {
		this.checkbox.prop('checked', this.checkbox.prop('checked'));
	}

	toggle() {
		this.toggle_checkbox();
		this.row.toggleClass('selected');
	}

	clear() {
		this.checkbox.prop('checked', false);
		this.row.removeClass('selected');
	}

	set(condition) {
		if (this.checkbox) this.checkbox.prop('checked', condition);
		if (condition) this.row.addClass('selected');
		else this.row.removeClass('selected');
	}
}

class SelectableTable {
	constructor(data=[], make_row=null, on_click=null, on_all=null, on_toggle=null, on_clear=null, toolbar=true) {
		this.table       = $('<table></table>').attr({'class': 'selectable'});
		this.all         = $('<input>').attr({'type': 'checkbox' });
		this.all_link    = $('<a>all</a>').attr({'href': '#' });
		this.toggle      = $('<input>').attr({'type': 'checkbox' });
		this.toggle_link = $('<a>toggle</a>').attr({'href': '#' });
		this.clear_link  = $('<a>clear</a>').attr({'href': '#' });
		this.toolbar     = $('<div></div>');
		this.on_all      = on_all;
		this.on_toggle   = on_toggle;
		this.on_clear    = on_clear;
		this.rows        = [];

		this.toolbar.append(this.all, this.all_link, ' | ', this.toggle, this.toggle_link, ' | ', this.clear_link,);


		this.all.click(() => this.all_(this.all.checked));

		this.all_link.click(() => {
			this.all.checked = !this.all.checked;
			this.all_(this.all.checked);
		});

		this.toggle.click(() => this.toggle_());

		this.toggle_link.click(() => {
			this.toggle.checked = !this.toggle.checked;
			this.toggle_();
		});

		this.clear_link.click(() => this.clear_());

		if (toolbar) {
			this.table.append(
				$('<tr></tr>').addClass('toolbar').append(
					$('<td></td>').attr({"colspan": "100"}).append(this.toolbar),
				)
			);
		} else {
			let toolbar_ = $(`.toolbar[for=${this.table.id}]`);
			if (toolbar_) toolbar_.append(this.toolbar);
		}

		for (let datum of data) {
			let row = make_row(datum, on_click);
			row.on_click = on_click;
			this.rows.push(row);
			this.table.append(row.row);
		}
	}

	all_(condition) {
		this.toggle.toggle(false);
		for (let row of this.rows) {
			row.set(condition);
		}
		if (this.on_all) this.on_all();
	}

	toggle_() {
		this.all.toggle(false);
		for (let row of this.rows) {
			row.toggle();
		}
		if (this.on_toggle) this.on_toggle();
	}

	clear_() {
		this.all.toggle(false);
		this.toggle.toggle(false);
		for (let row of this.rows) {
			row.clear();
		}
		if (this.on_clear) this.on_clear();
	}
}

class ImageEditor {
	constructor(show_preview, onfinnish, upload=false, upload_server='', upload_url='') {
		this.show_preview              = show_preview;
		this.ratio                     = 1;
		this.w_oreginal                = this.h_oreginal = 1;
		this.image                     = new Image();
		this.html                      = $('<div></div>');
		this.table                     = $('<table></table>');
		this.html.append(this.table);
		this.file_input                = $('<input>').attr({ 'type': 'file', 'accept': '.png, .jpg, .jpeg .gif' });
		this.show_btn                  = $('<button>show</button>').addClass('btn');
		this.ratio_show                = $('<span></span>');
		this.keep_ration_input         = $('<input>').attr({'type': 'checkbox'}).prop('checked', true);;
		this.h_input                   = $('<input>').attr({ 'type': 'number' });
		this.w_input                   = $('<input>').attr({ 'type': 'number' });
		this.resize_btn                = $('<button>Resize</button>').addClass('btn');
		this.title_input               = $('<input>');
		this.alt_input                 = $('<input>');
		this.desc_input                = $('<textarea></textarea>');
		this.reset_btn                 = $('<button>Reset</button>').addClass('btn');
		this.finnish_btn               = $('<button>Finnish</button>').addClass('btn');
		this.img_container             = $('<div></div>').attr({ 'class': 'img_container' });
		this.image_desc                = $('<div></div>').attr({ 'class': 'img_desc' });
		this.title                     = '';
		this.desc                      = '';
		this.upload                    = upload;
		this.upload_url                = upload_server + upload_url;
		this.upload_server             = upload_server;
		this.bar                       = $('<div></div>').addClass('bar');
		this.percent                   = $('<div></div>').addClass('percent').text(0);
		this.progress                  = $('<div></div>').addClass('progress').append(this.bar, this.percent).hide();
		this.loaded                    = false;

		this.disable();

		if (this.show_preview) {
			this.img_container.append(
				this.image,
				this.image_desc,
			);

			this.table.append(
				$("<tr></tr>").append(
					$("<td></td>").attr({"colspan": 2}).append(
						this.img_container
					),
				),
			);
		}

		this.table.append(
			$("<tr></tr>").append(
				$("<td></td>").attr({"colspan": 2}).append(this.progress),
			),
			$("<tr></tr>").append(
				$("<td></td>").append(this.file_input),
				$("<td></td>").append(this.show_btn),
			),
			$("<tr></tr>").append(
				$("<td></td>").append("Ratio: "),
				$("<td></td>").append(this.ratio_show),
			),
			$("<tr></tr>").append(
				$("<td></td>").append("Keep ratio"),
				$("<td></td>").append(this.keep_ration_input),
			),
			$("<tr></tr>").append(
				$("<td></td>").append("Width"),
				$("<td></td>").append(this.w_input),
			),
			$("<tr></tr>").append(
				$("<td></td>").append("Height"),
				$("<td></td>").append(this.h_input),
			),
			$("<tr></tr>").append(
				$("<td></td>").attr({"colspan": 2}).append(this.resize_btn),
			),
			$("<tr></tr>").append(
				$("<td></td>").append("Image title"),
				$("<td></td>").append(this.title_input),
			),
			$("<tr></tr>").append(
				$("<td></td>").append("Image alt"),
				$("<td></td>").append(this.alt_input),
			),
			$("<tr></tr>").append(
				$("<td></td>").attr({"colspan": 2}).append(this.desc_input),
			),
			$("<tr></tr>").append(
				$("<td></td>").attr({"colspan": 2}).css({"text-align": "right"}).append(
					this.reset_btn,
					this.finnish_btn,
				),
			),
		);

		if (onfinnish) {
			this.finnish_btn.click(() => {
				onfinnish();
				this.reset();
			});
		}

		this.reset_btn.click(() => this.reset());

		this.show_btn.click(() => {
			this.load_img();
		});

		this.file_input.change(() => {
			this.load_img();
		});

		this.w_input.change(() => {
			if (this.keep_ration_input[0].checked) {
				let new_w = parseInt(this.w_input.val());
				let new_h = Math.floor(new_w * this.ratio);
				this.h_input.val(new_h);

				this.image.height = new_h;
				this.image.width = new_w;
				this.show_ratio(new_w, new_h);
			}
		});

		this.h_input.change(() => {
			if (this.keep_ration_input[0].checked) {
				let h = parseInt(this.h_input.val());
				let w = Math.floor(h / this.ratio);
				this.w_input.val(w);

				this.image.height = h;
				this.image.width = w;
				this.show_ratio(w, h);
			}
		});

		this.resize_btn.click(() => {
			this.image.width = this.w_oreginal;
			this.image.height = this.h_oreginal;
			this.w_input.val(this.image.width);
			this.h_input.val(this.image.height);
			this.show_ratio(this.w_oreginal, this.h_oreginal);
		});

		this.title_input.change(() => {
			this.title = this.title_input[0].value.trim(' \n');
			this.image.setAttribute('title', this.title);
			this.format_desc();
		});

		this.alt_input.change(() => {
			let alt = this.alt_input[0].value.trim(' \n');
			this.image.setAttribute('alt', alt);
		});

		this.desc_input.change(() => {
			this.desc = this.desc_input[0].value.trim(' \n');
			this.format_desc();
		});
	}

	load_img() {
		if (this.upload && !this.loaded) {
			this.progress.show();
			let fd = new FormData();

			$.getJSON(this.upload_url, (data) => {
				let csrf_token = data['csrf_token'];
				fd.set('csrf_token', csrf_token);
				fd.set('file', this.file_input[0].files[0]);

				let xhr = new window.XMLHttpRequest();
				xhr.open('POST', this.upload_url);
				xhr.setRequestHeader("X-CSRFToken", csrf_token);

				xhr.upload.onprogress = ({loaded, total}) => {
					let fileLoaded = Math.floor((loaded / total) * 100);
					this.bar.css({'width': fileLoaded + '%'});
					this.percent.text(fileLoaded);
				}

				xhr.onreadystatechange = () => {
					if (xhr.readyState == 4 && xhr.status == 200) {
						let data = JSON.parse(xhr.response);
						this.image.src = this.upload_server + data['image_url'];
						this.loaded = true;
					}
				};

				xhr.send(fd);
			});
		} else {
			var f_reader = new FileReader();
			f_reader.readAsDataURL(this.file_input[0].files[0]);
			f_reader.addEventListener('load', (event) => {
				this.image.src = event.target.result;
			});
		}
		this.image.addEventListener('load', () => {
			this.progress.fadeOut(5000, "swing");
			this.enable();
			this.w_oreginal = this.image.width;
			this.h_oreginal = this.image.height;
			this.w_input.val(this.image.width);
			this.h_input.val(this.image.height);
			this.ratio = this.image.height / this.image.width;
			this.show_ratio(this.image.width, this.image.height);
		});
	}

	set_image(image, copy=false) {
		if (copy) this.image = image.cloneNode(true);
		else this.image = image;
		this.w_oreginal = this.image.width;
		this.h_oreginal = this.image.height;
		this.w_input.val(this.image.width);
		this.h_input.val(this.image.height);
		this.ratio = this.image.height / this.image.width;
		this.show_ratio(this.image.width, this.image.height);
		this.file_input.prop('disabled', true);
		this.show_btn.prop('disabled', true);
		this.file_input.hide();
		this.show_btn.hide();
	}

	reset() {
		this.w_input.val('');
		this.keep_ration_input.val('');
		this.ratio_show.text('');
		this.h_input.val('');
		this.title_input.val('');
		this.alt_input.val('');
		this.desc_input.val('');
		this.file_input.val('');

		this.image = new Image();
		this.img_container.html('');
		this.title = '';
		this.desc = '';
		this.image_desc.text('');
		this.img_container.append(
			this.image,
			this.image_desc,
		);
		this.bar.css({'width': 0 + '%'});
		this.percent.text(0);
		this.progress.hide();
		this.loaded = false;

		this.disable();
	}

	get_image() {
		return this.image.cloneNode(true);
	}

	disable() {
		this.w_input.prop('disabled', true);
		this.keep_ration_input.prop('disabled', true);
		this.show_btn.prop('disabled', true);
		this.h_input.prop('disabled', true);
		this.resize_btn.prop('disabled', true);
		this.title_input.prop('disabled', true);
		this.alt_input.prop('disabled', true);
		this.desc_input.prop('disabled', true);
		this.reset_btn.prop('disabled', true);
		this.finnish_btn.prop('disabled', true);
	}

	enable() {
		this.w_input.prop('disabled', false);
		this.keep_ration_input.prop('disabled', false);
		this.show_btn.prop('disabled', false);
		this.h_input.prop('disabled', false);
		this.resize_btn.prop('disabled', false);
		this.title_input.prop('disabled', false);
		this.alt_input.prop('disabled', false);
		this.desc_input.prop('disabled', false);
		this.reset_btn.prop('disabled', false);
		this.finnish_btn.prop('disabled', false);
	}

	show_ratio(w, h) {
		this.ratio_show.text("w " + w + "px: h " + h + "px");
	}

	format_desc() {
		this.image_desc.text('');
		this.image_desc.append($(`<cite>${this.title}</cite>`));
		if (this.desc) {
			this.image_desc.text(`(${this.desc})`);
		}
	}
}

class ImageSettings {
	constructor(img, src='') {
		this.image = (img) ? img: $('<img>').attr({'src': src}).addClass('image_settings')[0];
		this.image.classList.add('image_settings');

		this.image_editor = new ImageEditor(false, () => null, upload=false, upload_server='', upload_url='');
		this.image_editor.set_image(this.image);
		this.image_editor_modal = new Modal(this.image_editor.html, 'Image settings', null, () => null);

		this.image.onclick = () => this.image_editor_modal.start();
	}
}

class InsertSpecial {
	constructor(oninsert) {
		this.search            = $('<input>').attr({'type': 'search'});
		this.font              = $('<select>');
		this.subset            = $('<select>');
		this.symbol_list       = $('<div></div>').addClass('symbol_list');
		this.selected_symbol    = $('<div></div>').addClass('selected_symbol');
		this.symbol_info       = $('<span></span>');
		this.hexadecimal_input = $('<input>').attr({'type': 'text'});
		this.decimal_input     = $('<input>').attr({'type': 'number'});
		this.favorite_btn      = $('<button>Favorite</button>').addClass('btn');
		this.recent_list       = [];
		this.recent            = $('<div></div>').addClass('symbol_list');
		this.favorite_list     = [];
		this.favorite          = $('<div></div>').addClass('symbol_list');
		this.cancel_btn        = $('<button>Cancel</button>').addClass('btn');
		this.insert_btn        = $('<button>Insert</button>').addClass('btn');
		this.symbol_data       = {};
		this.data_loded        = false;
		this.selected_data     = [];
		this.all               = [];

		this.html = $('<div></div>').addClass('insert_symbol').append(
			$('<div></div>').addClass('toolbar').append(
				$('<table></table>').append(
					$('<tr></tr>').append(
						$('<td></td>').text('Search'),
						$('<td></td>').text('Font'),
						$('<td></td>').text('Subset'),
					),
					$('<tr></tr>').append(
						$('<td></td>').append(this.search),
						$('<td></td>').append(this.font),
						$('<td></td>').append(this.subset),
					),
				),
			),
			$('<div></div>').addClass('selector').append(
				this.symbol_list,
				$('<div></div>').addClass('preview').append(
					this.selected_symbol,
					this.symbol_info,
					$('<table></table>').append(
						$('<tr></tr>').append(
							$('<td></td>').text('Hexadecimal'),
							$('<td></td>').append(this.hexadecimal_input),
						),
						$('<tr></tr>').append(
							$('<td></td>').text('Decimal'),
							$('<td></td>').append(this.decimal_input),
						),
						$('<tr></tr>').append(
							$('<td></td>').attr({'colspan': 2}).append(this.favorite_btn),
						),
					),
				),
			),
			$('<div></div>').addClass('other').append(
				$('<table></table>').append(
					$('<tr></tr>').append(
						$('<td></td>').text('Recent:'),
						$('<td></td>').append(this.recent),
					),
					$('<tr></tr>').append(
						$('<td></td>').text('Favorite:'),
						$('<td></td>').append(this.favorite),
					)
				),
				$('<br>'),
				$('<div></div>').addClass('buttons').append(this.cancel_btn, this.insert_btn),
			),
		);

		let fonts = ['Blackadder ITC', 'Agency FB', 'Bauhaus 93'];
		for (let font of fonts) {
			this.font.append($(`<option>${font}</option>`));
		}

		$.getJSON('./symbols.json', (data) => {
			this.symbol_data = data;
			for (let subset of Object.keys(this.symbol_data)) {
				this.subset.append($(`<option>${subset}</option>`).val(subset));
			}
			this.load_symbols(this.symbol_data[Object.keys(this.symbol_data)[0]]);
			this.all = [].concat(...Object.values(this.symbol_data));
		});

		this.insert_btn.click(() => {
			if (oninsert) oninsert();
		});

		this.subset.change(() => {
			this.load_symbols(this.symbol_data[this.subset.val()]);
		});

		this.favorite_btn.click(() => {
			let [n, info] = this.selected_data;
			if (this.favorite_list.length >= 2) {
				if (this.favorite_list[0][0] != n) this.favorite_list.unshift([n, info]);
			} else this.favorite_list.unshift([n, info]);
			if (this.favorite_list.length >= 10) this.favorite_list.pop();

			this.favorite.html('');
			for (let [n, info] of this.favorite_list) this.favorite.append(this.create_symbol(n, info))
		});

		this.search.change(() => {
			let sq = this.search.val();
			if (sq) {
				let results = this.all.filter(([n, info]) => info.toLowerCase().includes(sq));
				this.load_symbols(results);
			} else {
				this.symbol_list.html('');
				this.load_symbols(this.symbol_data[this.subset.val()]);
			}
		});
	}

	create_symbol(n, info) {
		return $('<div></div>').addClass('symbol').attr({'title': info}).html(`&#${n};`).click(() => this.show_preview(n, info));
	}

	load_symbols(symbol_list) {
		this.symbol_list.html('');
		for (let [n, info] of symbol_list)
			this.symbol_list.append(this.create_symbol(n, info));
	}

	add_recent(n, info) {
		if (this.recent_list.length >= 2) {
			if (this.recent_list[0][0] != n) this.recent_list.unshift([n, info]);
		} else this.recent_list.unshift([n, info]);
		if (this.recent_list.length >= 10) this.recent_list.pop();
		
		this.recent.html('');
		for (let [n, info] of this.recent_list) this.recent.append(this.create_symbol(n, info))
	}

	show_preview(n, info) {
		this.symbol_info.text(info);
		this.decimal_input.val(n);
		this.hexadecimal_input.val(n.toString(16));
		this.selected_symbol.html(`&#${n};`);
		this.add_recent(n, info);
		this.selected_data = [n, info];
	}

	reset() {
		this.search.val('');
		this.hexadecimal_input.val('');
		this.decimal_input.val('');
		this.selected_data = [];
		this.selected_symbol.html('');
		this.symbol_list.html('');
		this.recent.html('');
		this.favorite.html('');
	}

	get_symbol() {
		return `&#${this.selected_data[0]};`;
	}
}

class HTMLEditor {
	constructor(icon_url='', ...args) {
		// html_input is for initialiying html_editors by settings <input type="text" class="html_editor">
		this.html_input = $('<input>').attr({'type': 'text'}).hide();
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
				['Clear', icon_url + 'page_white_delete.png', () => { this.format('delete'); this.ism.html('') }],
				['Rndo', icon_url + 'arrow_undo.png', () => { this.format('undo') }],
				['Redo', icon_url + 'arrow_redo.png', () => { this.format('redo') }],
				['Remove formatting', icon_url + 'font_delete.png', () => { this.format('removeFormat') }],
			],
			[
				['Bold', icon_url + 'text_bold.png', () => { this.format('bold') }],
				['Italic', icon_url + 'text_italic.png', () => { this.format('italic') }],
				['Underline', icon_url + 'text_underline.png', () => { this.format('underline') }],
				['Strike through', icon_url + 'text_strikethrough.png', () => { this.format('strikethrough') }],
				['Sub script', icon_url + 'text_subscript.png', () => { this.format('subscript') }],
				['Super script', icon_url + 'text_superscript.png', () => { this.format('superscript') }],
			],
			[
				['Left align', icon_url + 'text_align_left.png', () => { this.format('justifyleft') }],
				['Center align', icon_url + 'text_align_center.png', () => { this.format('justifycenter') }],
				['Right align', icon_url + 'text_align_right.png', () => { this.format('justifyright') }],
				['Dotted list', icon_url + 'text_list_bullets.png', () => { this.format('insertunorderedlist') }],
				['Numbered list', icon_url + 'text_list_numbers.png', () => { this.format('insertorderedlist') }],
				['Add indentation', icon_url + 'text_indent.png', () => { this.format('indent') }],
				['Delete indentation', icon_url + 'text_indent_remove.png', () => { this.format('outdent') }],
			],
			[
				['Cut', icon_url + 'cut.png', () => { this.format('cut') }],
				['Copy', icon_url + 'page_copy.png', () => { this.format('copy') }],
				['Paste', icon_url + 'paste_plain.png', () => { this.format('paste') }],
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

		this.link_btn = $('<a></a>').attr({ 'href': '#', 'title': 'Insert link' }).addClass('btn').append($('<img>').attr('src', icon_url + 'link.png'));
		this.symbol_selector_btn = $('<a></a>').attr({ 'href': '#', 'title': 'Insert symbol' }).addClass('btn').append($('<img>').attr('src', icon_url + 'text_letter_omega.png'));
		this.image_btn = $('<a></a>').attr({ 'href': '#', 'title': 'Insert image' }).addClass('btn').append($('<img>').attr('src', icon_url + 'insert_image.png'));
		this.html_btn = $('<a></a>').attr({ 'href': '#', 'title': 'HTML' }).addClass('btn html').append($('<img>').attr('src', icon_url + 'page_white_code.png'));

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

		this.textbox.keyup(() => this.update_html_input());
	}

	add_link(editor) {
		return () => {
			let link = editor.link_input.val();
			if (link && link != '' && link != `http://`) {
				editor.format('createlink', link);
				editor.format('createlink', link);
			}
			editor.link_input.val('http:\/\/');
			editor.update_html_input();
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
		this.update_html_input();
	}

	start_html_editor() {
		this.code_textarea.hide();
		this.textbox.show();

		this.textbox.html(this.code_textarea.val());
		this.update_html_input();
	}

	format(sCmd, sValue) {
		if (this.MODE == 'html') {
			document.execCommand(sCmd, false, sValue);
			this.textbox.focus();
		}
		document.execCommand('enableObjectResizing', true, true);
		document.execCommand('enableAbsolutePositionEditor', true, true);
		this.update_html_input();
	}

	insert_image(editor) {
		return () => {
			let ei = new ImageSettings(editor.image_editor.get_image());
			editor.ism.append(ei.image_editor_modal.modal);
			editor.textbox.append(ei.image);

			editor.update_html_input();

			editor.image_editor_modal.stop();
			editor.image_editor.reset();
		}
	}

	insert_symbol(editor) {
		return () => {
			editor.textbox.append(editor.symbol_selector.get_symbol());
			editor.update_html_input();
			editor.symbol_selector_modal.stop();
			editor.symbol_selector.reset();
		}
	}

	update_html_input() {
		this.html_input.value = this.textbox.html();
	}

	set_html_input(e) {
		this.html_input = e;
		this.textbox.html(this.html_input.value);
	}
}

function make_modal(modal_) {
	let modal         = $(modal_);
	let modal_content = $(modal.find(`div.modal_content`));

	modal_content.prepend(
		$('<span>&times;</span>').addClass('modal_close').click(function () {
			modal.hide();
		})
	);

	if (modal.id) {
		$(`[for=${modal.id}]`).click(function () { modal.show() });
	}

	modal.click(function(event) {
		if (event.target == modal[0] && event.target != modal_content[0]) {
			modal.hide();
		}
	});
}

function start_modal(id) {
	$(id).show();
}

function stop_modal(id) {
	$(id).hide();
}

$(function() {
	let imgs = $('.image_settings');
	for (let e of imgs) {
		let is = new ImageSettings(e);
		e.parentNode.insertBefore(is.image_editor_modal.modal[0], e);
	}

	$(".alert").prepend(
		$("<span>&times;</span>").addClass("alert_close").click(function() {
			this.parentElement.style['display'] = "none";
		})
	);
	$(".alert.autoclose").fadeOut(5000, "swing");

	let mss = $(".multiple_select").hide();
	for(let e of mss) {
		let lh     = (e.dataset["left_header"]) ? e.dataset["left_header"]: "Left";
		let rh     = (e.dataset["right_header"]) ? e.dataset["right_header"]: "Right";
		let sopt   = Array.from(e.selectedOptions);
		let unsopt = Array.from(e.options).filter(n => !sopt.includes(n));
		let ms     = new MultipleSelect(unsopt, sopt, lh, rh);
		ms.set_selection(e);
		e.parentNode.insertBefore(ms.html[0], e);
	}

	let modals = $('div.modal:not([modal_type=DYNAMIC_MODAL])');

	for (let m of modals) {
		make_modal(m.id);
	}

	let html_editors = $('input.html_editor').hide();
	for (let i of html_editors) {
		let htmle = new HTMLEditor(icon_url = i.getAttribute('icon_url'));
		htmle.set_html_input(i);
		i.parentNode.insertBefore(htmle.editor[0], i);
	}
});
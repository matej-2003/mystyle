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

		// if (upload) this.progress.show();
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
					// let fileTotal = Math.floor(total / 1000);
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
		// this.ratio = w / h;
	}

	format_desc() {
		this.image_desc.text('');
		this.image_desc.append($(`<cite>${this.title}</cite>`));
		if (this.desc) {
			this.image_desc.text(`(${this.desc})`);
		}
	}
}
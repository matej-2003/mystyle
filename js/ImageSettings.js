class ImageSettings {
	constructor(img, src='') {
		this.image = (img) ? img: $('<img>').attr({'src': src}).addClass('image_settings')[0];
		this.image.classList.add('image_settings');

		this.image_editor = new ImageEditor(false, () => null, upload=false, upload_server='', upload_url='');
		this.image_editor.set_image(this.image);
		this.image_editor_modal = new Modal(this.image_editor.html, 'Image settings', null, () => null);

		// this.image.click(() => this.image_editor_modal.start());
		this.image.onclick = () => this.image_editor_modal.start();
	}
};

$(function() {
	let imgs = $('.image_settings');
	for (let e of imgs) {
		let is = new ImageSettings(e);
		// console.log(is.image_editor_modal.modal[0], e);
		e.parentNode.insertBefore(is.image_editor_modal.modal[0], e);
	}
});
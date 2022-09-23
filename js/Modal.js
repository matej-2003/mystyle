function make_modal(id) {
	let modal         = $(`div.modal#${id}`);
	let modal_content = $(`div.modal#${id} div.modal_content`);

	modal_content.prepend(
		$('<span>&times;</span>').addClass('modal_close').click(function () {
			modal.hide();
		})
	);
	$(`[for=${id}]`).click(function () { modal.show() });

	modal.click(function(event) {
		if (event.target == modal[0] && event.target != modal_content[0]) {
			modal.hide();
		}
	});
}

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
		// if (onclose) onclose();
	}

	stop() {
		this.modal.hide();
	}
}

function start_modal(id) {
	$(id).show();
}

function stop_modal(id) {
	$(id).hide();
}

let modals = $('div.modal:not([modal_type=DYNAMIC_MODAL])');

for (let i = 0; i < modals.length; i++) {
	make_modal(modals[i].id);
}
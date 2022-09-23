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
};

$(function() {
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
});
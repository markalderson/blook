var paginated_elements = document.getElementsByClassName('msl-paginated');
var num_paginated_elements = paginated_elements.length;
var pagination_data = {};
function overflowing(element) {
	return element.scrollHeight > element.clientHeight;
}
function paginate(element) {
	while (morePages(element)) newPage(element);
	showPage(element, 0);
}
function morePages(element) {
	var last_page = lastPage(element);
	if (!last_page) return true;
	return last_page.stop != element.lastChild;
}
function lastPage(element) {
	var pages = getPages(element);
	if (!pages) return null;
	var num_pages = pages.length;
	return pages[num_pages - 1];
}
function getPages(element) {
	var element_data = paginationData(element);
	if (!element_data) return null;
	return element_data.pages;
}
function addPage(element, page) {
	var pages = getPages(element);
	if (!pages) {
		paginationData(element).pages = [];
		pages = paginationData(element).pages;
	}
	pages.push(page);
}
function paginationData(element) {
	if (!pagination_data[element.id]) pagination_data[element.id] = {}
	return pagination_data[element.id];
}
function newPage(element) {
	var new_page = {};
	var last_page = lastPage(element);
	if (!last_page) new_page.start = element.firstChild;
	else new_page.start = last_page.stop.nextSibling;
	hideBefore(element, new_page.start);
	new_page.stop = element.lastChild;
	while (overflowing(element)) {
		hide(new_page.stop);
		new_page.stop = new_page.stop.previousSibling;
	}
	addPage(element, new_page);
	showAfter(element, new_page.stop);
}
function hide(element) {
	if (element.style) element.style.display = 'none';
}
function show(element) {
	if (element.style) element.style.display = 'inherit';
}
function hideBefore(element, child) {
	var sibling = child.previousSibling;
	while (sibling) {
		hide(sibling);
		sibling = sibling.previousSibling;
	}
}
function showAfter(element, child) {
	var sibling = child.nextSibling;
	while (sibling) {
		show(sibling);
		sibling = sibling.nextSibling;
	}
}
function hideAfter(element, child) {
	var sibling = child.nextSibling;
	while (sibling) {
		hide(sibling);
		sibling = sibling.nextSibling;
	}
}
function showBetween(start, stop) {
	while (start !== stop) {
		show(start);
		start = start.nextSibling;
	}
	show(stop);
}
function showPage(paginated_element, i) {
	var page = getPages(paginated_element)[i];
	if (page) {
		hideBefore(paginated_element, page.start);
		showBetween(page.start, page.stop);
		hideAfter(paginated_element, page.stop);
	}
}

// Example
var view_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var view_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var my_content = document.getElementById('my_content');
my_content.style.width = view_width * 0.6 + 'px';
my_content.style.height = view_height * 0.85 + 'px';
my_content.style.overflowY = 'auto';
for (var i = 0; i < num_paginated_elements; i++) {
	var paginated_element = paginated_elements[i];
	paginate(paginated_element);
}
var current = 0;
var max = getPages(my_content).length;
function prev() {
	showPage(my_content, current - 1);
	if (current > 0) current--;
};
document.body.onkeyup = function (event) {
	var key = event.keyCode;
	if (key === 37 || key === 38) prev();
	if (key === 39 || key === 40) next();
};
function next() {
	showPage(my_content, current + 1);
	if (current < max - 1) current++;
};
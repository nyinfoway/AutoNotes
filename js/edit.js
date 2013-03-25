$(function() {
	$("input:[type='button'],button", ".demo").button();

});
$(document)
		.ready(
				function() {
					var value = window.localStorage.getItem("notes");
					$("#notesedit").html(
							'<div id="notesforediting" contenteditable=true>'
									+ value + '</div>');
					$("#notesedit")
							.keyup(
									function() {
										window.localStorage.setItem("notes", $(
												"#notesforediting").html());

										$("toggleEditor")
												.html(
														'<span class="ui-button-text">Saved...</span>');
										$("#toggleEditor")
												.fadeOut(
														3000,
														function() {
															$("#toggleEditor")
																	.fadeIn(100);
															$("toggleEditor")
																	.html(
																			'<span class="ui-button-text">Save</span>');
														});

									});
					$("#toggleEditor")
							.click(
									function() {
										window.localStorage.setItem("notes", $(
												"#notesforediting").html());

										$("toggleEditor")
												.html(
														'<span class="ui-button-text">Saved...</span>');
										$("#toggleEditor")
												.fadeOut(
														3000,
														function() {
															$("#toggleEditor")
																	.fadeIn(100);
															$("toggleEditor")
																	.html(
																			'<span class="ui-button-text">Save</span>');
															$("button")
																	.button();
														});

									});
					$("button").button();

					$("#cnotes").click(function() {
						history.back();
					});
				});

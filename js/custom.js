(function( $ ) {


	function serializeLayout(grid) {
		var itemIds = grid.getItems().map(function (item) {
			return item.getElement().getAttribute('data-id');
		});
		return JSON.stringify(itemIds);
	}

	function saveLayout(key, grid) {
		var layout = serializeLayout(grid);
		window.localStorage.setItem(key, layout);
	}

	function loadLayout(key, grid, serializedLayout) {
		var layout = JSON.parse(serializedLayout);
		var currentItems = grid.getItems();
		var currentItemIds = currentItems.map(function (item) {
			return item.getElement().getAttribute('data-id');
		});
		var newItems = [];
		var itemId;
		var itemIndex;

		for (var i = 0; i < layout.length; i++) {
			itemId = layout[i];
			itemIndex = currentItemIds.indexOf(itemId);
			if (itemIndex > -1) {
				newItems.push(currentItems[itemIndex])
			}
		}

		grid.sort(newItems, {layout: 'instant'});
	}



	function initGrid() {

		document.querySelectorAll('.components__grid.sortable').forEach((gridItem, index) => {

			let grid;
			let storageId = `${gridItem.getAttribute('id') ? gridItem.getAttribute('id') : `layout-${index}`}`;

			grid = new Muuri(gridItem, {
				dragEnabled: true,
				dragSort : true,
				layoutOnInit: true,
				layoutOnResize : 100,
				alignRight: false,
				alignBottom: false,
				rounding: false,
			}).on('move', function () {
				grid.refreshItems();
				saveLayout(storageId, grid);
			});


			var layout = window.localStorage.getItem(storageId);

			grid.layout(true);
			if (layout) {
				loadLayout(storageId, grid, layout);
			}



			$('.dashboard__hamburger').on('click', function() {
				setTimeout(function() {
					grid.refreshItems();
					grid.refreshSortData();
					grid.layout();
					saveLayout(undefined, grid);
				}, 400);
			});



			$(document).on('click', '.widget__preview_action', function(e) {
				let removeIndex = $(this).parents('.components__grid_column').index();
				let dataId = $(this).parents('.components__grid_column').attr('data-id');
				var storedDataArray = JSON.parse(window.localStorage.getItem(storageId)) || [];
				if(storedDataArray.length) {
					grid.remove(grid.getItems(storedDataArray.indexOf(dataId)), {removeElements: true});
				} else {
					grid.remove(grid.getItems(removeIndex), {removeElements: true});
				}
				saveLayout(storageId, grid);
			});




			$('.dashboard__widgets_list_item_add').on('click', function() {
			
				let previewSrc = $(this).parents('.dashboard__widgets_list_item').find('.dashboard__widgets_list_item_tabs_panel.active .info__box img').attr('src');
				const titleText = $(this).parents('.dashboard__widgets_list_item').find('.dashboard__widgets_list_item_header_title').text();
				
				const html = `
					<div class="components__grid_column">
						<div class="info__box wp">
							<div class="widget__preview">
								<a href="javascript:void(0);" class="widget__preview_action"></a>
								<img src="img/${previewSrc.slice(previewSrc.lastIndexOf('/') + 1)}" alt="widget">
								<h6 class="widget__preview_title">${titleText}</h6>
							</div>
						</div>
					</div>
				`;

				$(gridItem).append(html);
				document.querySelectorAll('.components__grid_column')[document.querySelectorAll('.components__grid_column').length - 1].setAttribute('data-id', $(document.querySelectorAll('.components__grid_column')[document.querySelectorAll('.components__grid_column').length - 1]).index() + 1);
				grid.add(document.querySelectorAll('.components__grid_column')[document.querySelectorAll('.components__grid_column').length - 1]);
				grid.layout();
				grid.refreshItems();
				grid.refreshSortData();
				saveLayout(storageId, grid);
			});



		});

	}



	if($('.dashboard__content').length) {
		$('html').stop().addClass('dashboard__html');
	}






	/*document ready*/
	$(document).ready(function(){


		$.fn.datepicker.language['en'] =  {
		    days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Satturday'],
		    daysShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
		    daysMin: ['Sn','Mn','Tu','Wd','Th','Fr','St'],
		    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
		    monthsShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','dec'],
		    today: 'Tuday',
		    clear: 'Clear',
		    dateFormat: 'mm.dd.yyyy',
		    timeFormat: 'hh:ii',
		    firstDay: 1
		};


		$('[data-calendar]').each(function() {
			let calendarInput = $(this),
					maxDate = Boolean(calendarInput.attr('data-min'));
			calendarInput.datepicker({
				// inline: true,
				range: true,
				language: 'en',
				dateFormat: 'M dd, yyyy',
				maxDate: maxDate ? new Date() : null,
				position: "bottom right",
				onSelect: function(formattedDate, date, inst) {
					inst.hide();
					$(inst.el).parent().stop().removeClass('show');
				},
				onShow: function(inst, animationCompleted) {
					$(inst.el).parent().stop().addClass('show');
				}
			});


			calendarInput.datepicker().data('datepicker').selectDate(new Date());
		});




		$('table').wrap('<div class="table__wrapper"></div>');

		$(document).on('click touchstart', function (event) {
			if (!$(event.target).closest('.jq-selectbox').length) {
				$('.jq-selectbox').stop().removeClass('focused');
			}
		});







		/* ---------- dashboard header ---------- */

		$('.dashboard__hamburger').on('click', function() {
			$(this).stop().toggleClass('active');
			$('.dashboard__nav').stop().toggleClass('show');
			$('.dashboard__content, .dashboard__header, .dashboard__content_tabs, .dashboard__content_nested_tabs').stop().toggleClass('resized');
			setTimeout(function() {
				$('.incoming__info_unit_slider').slick('setPosition');
			}, 400);
		});


		$(window).on('scroll', function() {
			let st = $(this).scrollTop();
			if(st > 0) {
				$('.dashboard__header').stop().addClass('sticky');
			}
			else {
				$('.dashboard__header').stop().removeClass('sticky');
			}
		});


		$('.dashboard__menu li a').on('click', function() {
			$('.dashboard__menu li').stop().removeClass('active');
			$(this).parent().stop().addClass('active');
		});


		$('.note__info_box_link').on('click', function() {
			$(this).stop().toggleClass('active');
			$(this).parent().find('.note__info_box').stop().toggleClass('show');
		});

		$(document).on('click touchstart', function (event) {
			if (!$(event.target).closest('.note__info_box_link, .note__info_box').length) {
				$('.note__info_box').stop().removeClass('show');
				$('.note__info_box_link').stop().removeClass('active');
			}
		});






		/* ---------- data table component ---------- */


		if($('.table__sort').length) {

			$('.table__sort').each(function() {
				let table = $(this),
						tableMaxHeight = table.attr('data-max-height') || null;

				let noSort = [];

				table.find('th').each(function(index) {
					$(this).hasClass('no-sort') ? noSort.push(index) : null;
				});
				

				setTimeout(function() {


					if(table.hasClass('full')) {

						const filterColumns = [];
						const filterColumnsIndexes = [];

						table.find('th').each(function(index) {
							$(this).hasClass('filter') ? filterColumns.push(true) : filterColumns.push(false);
						});

						filterColumns.forEach((item,index) => {
							item === true ? filterColumnsIndexes.push(index) : null;
						});

						
						table.DataTable({
							dom: '<"top__line"' + '<"top__line_left"fl>' + '<"top__line_right">>rt<"bottom__line"ip><"clear">',
							// paging: false,
							// info: false,
							responsive: true,
							// searching: false,
							columnDefs: [
								{ orderable: false, 
									targets: noSort 
								}
							],
							"order": [],
							language: {
								search: "_INPUT_",
								searchPlaceholder: "Search",
								lengthMenu: "Show per Page _MENU_",
							},
							"lengthMenu": [ [10, 15, 20, 25, 50, -1], [10, 15, 20, 25, 50, "All"] ],
							initComplete: function () {

								const filtersWrapper = table.parents('.dataTables_wrapper').find('.top__line_right');

								filtersWrapper.append('<button class="table__filters">Filter</button>');

								table.parents('.dataTables_wrapper').find('.table__filters').on('click', function() {
									table.parents('.dataTables_wrapper').find('.table__filter').stop().toggleClass('show');
								});


								this.api().columns(filterColumnsIndexes).every( function (i) {
									const column = this;
									const filterTitle = table.find(`th:nth-child(${i + 1})`).text();
									const filterWrapper = $('<div class="table__filter">').appendTo(filtersWrapper);
									const filterWrapperTitle = $(`<span>${filterTitle}:</span>`).appendTo(filterWrapper);
									const select = $('<select><option value="">All</option></select>')
									.appendTo(filterWrapper)
									.on( 'change', function () {
										var val = $.fn.dataTable.util.escapeRegex($(this).val());

										column
										.search( val ? '^' + val + '$' : '', true, false )
										.draw();
									});

									column.data().unique().sort().each( function ( d, j ) {
										if(d.indexOf('span') === 1) {
											select.append( '<option value="' + d.slice(d.indexOf('>') + 1, d.lastIndexOf('</')) + '">' + d.slice(d.indexOf('>') + 1, d.lastIndexOf('</')) + '</option>' )
										} else {
											select.append( '<option value="' + d + '">' + d + '</option>' );
										}
										
									});
								});
							},
						});

					} else {

						table.DataTable({
							paging: false,
							info: false,
							responsive: true,
							searching: false,
							columnDefs: [
								{ orderable: false, 
									targets: noSort 
								}
							],
							"order": []
						});

					}

				}, 0);
			});

		}

		// End Data Table Component





		/* ---------- Info Unit Slider ---------- */

		if($('.incoming__info_unit_slider').length) {
			$('.incoming__info_unit_slider').each(function() {
				const slider = $(this);
				slider.slick({
					slidesToShow: 1,
					slidesToScroll: 1,
					speed: 500,
					swipe: true,
					arrows: false,
					dots: true,
					infinite: true,
					fade: true,
					autoplay: true,
					autoplaySpeed: 7000
				});
			});
		}

		// End Info Unit Slider










		/* ---------- HIGHCHARTS ---------- */

		function numberWithSpaces(x) {
			return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ");
		}

		/* ---------- double columns ---------- */

		if($('#financials__chart').length) {
			Highcharts.chart('financials__chart', {
				chart: {
					type: 'column',
					height: 240,
					style: {
						fontFamily: 'Poppins',
						fontSize: '1rem',
						fontWeight: '600',
					},
				},
				credits: {
					enabled: false
				},
				title: {
					text: ''
				},
				subtitle: {
					text: ''
				},
				xAxis: {
					categories: [
					'Jan',
					'Feb',
					'Mar',
					'Apr',
					'May',
					'Jun',
					'Jul',
					'Aug',
					'Sep',
					'Oct',
					'Nov',
					'Dec'
					],
					crosshair: true,
					labels: {
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4'
						}
					},
					crosshair: false,
				},
				yAxis: {
					min: 0,
					tickInterval: 20000,
					gridLineWidth: 0,
					minorGridLineWidth: 0,
					labels: {
						// format: '£ {value}',
						formatter: function() {
		          if ( this.value > 1000 ) return '£ ' + Highcharts.numberFormat( this.value/1000, 0) + "K";
		          return Highcharts.numberFormat(this.value,0);
		        },
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4',
						},
					},
					title: {
						text: ''
					}
				},
				tooltip: {
					valuePrefix: '£',
					headerFormat: '',
					pointFormat: '<span style="font-weight: 300">{series.name} </span><strong>{point.y}</strong><br />',
					footerFormat: '<span class="angle"></span>',
					style: {
						color: '#FFFFFF',
						fontWeight: '600',
					},
					shared: true,
					useHTML: true,
					shadow: false,
					borderRadius: 24,
					backgroundColor: '#F58020',
					positioner: function(labelWidth, labelHeight, point) {
			        var tooltipX = point.plotX + 0;
			        var tooltipY = point.plotY - 30;
			        return {
			            x: tooltipX,
			            y: tooltipY
			        };
			    }
				},
				legend: false,
				plotOptions: {
					column: {
						pointPadding: 0,
						borderWidth: 0,
						borderRadius: '0.4rem',
						pointWidth: 12,
						maxPointWidth: 12,
						groupPadding: 0,
					}
				},
				series: [{
					name: 'Sales',
					data: [21000, 10000, 18000, 42000, 43000, 70000, 82000, 62000, 55000, 38000, 60000, 81000],
					color: '#F58020',
					pointPlacement: 0.12,
					states: {
						hover: {
							enabled: false
						}
					},
				}, 
				{
					name: 'Target',
					data: [10000, 20000, 45000, 70000, 30000, 40000, 10000, 25000, 38000, 20000, 44000, 60000],
					color: '#FFF0D3',
					pointPlacement: -0.12,
					states: {
						hover: {
							enabled: false
						}
					},
				},
				]
			});
		}

		/* ---------- end double columns ---------- */




		/* ---------- area spline ---------- */

		let currentMonthDaysCount = moment().daysInMonth();
		let xAxisDays = [];
		let renderTrigger = true;


		for(let i = 1; i <= currentMonthDaysCount; i++) {
			xAxisDays.push(i);
		}

		if($('#financials__chart_alt').length) {

			let areaLineChart = Highcharts.chart('financials__chart_alt', {
				chart: {
					type: 'areaspline',
					height: 240,
					style: {
						fontFamily: 'Poppins',
						fontSize: '1rem',
						fontWeight: '600',
					},
					events: {
						render: function() {

							if(renderTrigger) {
								let total = 0;

								for(let i = 0; i < this.series.length; i++) {

									this.series[i].data.forEach(val => {
										total += val.y;
									});

									$(this.container.closest('.info__box_body')).find('.info__box_body_chart_info').append(`
										<div class="info__box_body_chart_info_item">
											<span class="info__box_body_chart_info_item_title">£ ${numberWithSpaces(+total)}</span>
											<span class="info__box_body_chart_info_item_text">Total ${this.series[i].name}</span>
										</div>
									`);

									$(this.container.closest('.info__box_body')).find('.info__box_body_chart_legends').append(`
										<div class="info__box_body_chart_legends_item">
											<i style="background-color: ${this.series[i].color}"></i>
											<span>${this.series[i].name}</span>
										</div>
									`);
								}

								renderTrigger = false;
							}
						}
					}
				},
				title: {
					text: ''
				},
				legend: false,
				xAxis: {
					categories: xAxisDays,
					tickmarkPlacement: 'on',
					startOnTick: true,
					gridLineWidth: 1,
					labels: {
						step: 1,
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4'
						}
					},
					accessibility:{
						enabled: true,
					},
				},
				yAxis: {
					title: {
						text: ''
					},
					min: 0,
					tickInterval: 20000,
					gridLineWidth: 0,
					minorGridLineWidth: 0,
					labels: {
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4'
						},
						formatter: function() {
							if ( this.value > 1000 ) return '£ ' + Highcharts.numberFormat( this.value/1000, 0) + "K";
							return Highcharts.numberFormat(this.value,0);
						},
					},
				},
				tooltip: {
					valuePrefix: '',
					headerFormat: '',
					pointFormat: '<span style="font-size: 0.8rem; font-weight: 300">{series.name} </span><strong>{point.y}</strong><br />',
					footerFormat: '<span class="angle"></span>',
					style: {
						color: '#FFFFFF',
						fontWeight: '600',
					},
					shared: true,
					useHTML: true,
					shadow: false,
					borderRadius: 24,
					backgroundColor: '#F58020',
					positioner: function(labelWidth, labelHeight, point) {
						var tooltipX = point.plotX + 15;
						var tooltipY = point.plotY - 30;
						return {
							x: tooltipX,
							y: tooltipY
						};
					}
				},
				credits: {
					enabled: false
				},
				plotOptions: {
					areaspline: {
						fillOpacity: 0.5
					},

					series: {
						lineWidth: 4,
						marker: {
							enabled: false,
							symbol: 'circle',
							radius: 6,
							fillColor: '#F58020',
	            lineWidth: 3,
	            lineColor: '#FFFFFF'
						},
						point: {
							events: {
								mouseOver: function() {
									var res = this.category;
									var chart = areaLineChart;
									data = [];
									for (var i = 0; i < chart.series.length; i++) {

										for (var j = 0; j < chart.series[i].points.length; j++){
											if(j == res)
											{
												data.push(chart.series[i].points[j].y)
											}

										}
									}
									maximum_value = (Math.max.apply(Math, data));
									for (var k = 0; k < data.length; k++) {
										if( data[k] == maximum_value )
										{
											first_set = k;
										}
									}
									var point = chart.series[first_set].data[res - 1];
									if(point !== undefined) {
										var x = point.plotX + chart.plotLeft;
										var y = point.plotY + chart.plotTop;
										var height =(chart.plotHeight-point.plotY);
										chart.renderer.rect(x, y, 1, height, 0).attr({fill: '#F58020', zIndex:0,id:'hl'}).add();
									}
								},
								mouseOut: function(e){
									$("#hl").remove();
								}
							}
						},
					}
				},
				series: [{
					name: 'Sales',
					data: [56574,55678,48699,40333,38555,35222,20000,9000,8900,10000,25000,40000,51687,55444,60000,70000,80000,82545,80000,65000,56777,52333,47556,42333,42000,45000,58000,72000,83000,80000,70000],
					color: '#F58020',
					fillColor: {
						linearGradient: [0, 0, 0, 150],
							stops: [
								[0, Highcharts.color('#F58020').setOpacity(0.15).get('rgba')],
								[1, Highcharts.color('#F58020').setOpacity(0).get('rgba')]
						]
					},
				}, {
					name: 'Target',
					data: [75574, 
								 79678,
								 79699,
								 80333,
								 76555,
								 60222,
								 55000,
								 58000,
								 59900,
								 60000,
								 62000,
								 64000,
								 64687,
								 70444,
								 70200,
								 67000,
								 60000,
								 57545,
								 45000,
								 25000,
								 20777,
								 19333,
								 21556,
								 33333,
								 40000,
								 42000,
								 45000,
								 48000,
								 52000,
								 58000,
								 59000],
					color: '#FFF0D3',
					fillColor: {
						linearGradient: [0, 0, 0, 300],
							stops: [
								[0, Highcharts.color('#ffe6b3').setOpacity(0).get('rgba')],
								[1, Highcharts.color('#ffe6b3').setOpacity(0).get('rgba')]
						]
					},
					marker: {
						fillColor: '#ffdd99',
					},
				}]
			});	

		

			// console.log();

			// areaLineChart.series[0].update({
			// 	data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
			// }, false);


			$('.redraw__finalt').on('click',function() {

				areaLineChart.series[0].update({
					data: [25574, 
								 49678,
								 69699,
								 10333,
								 46555,
								 90222,
								 45000,
								 28000,
								 49900,
								 30000,
								 12000,
								 84000,
								 24687,
								 20444,
								 20200,
								 57000,
								 60000,
								 77545,
								 85000,
								 95000,
								 30777,
								 29333,
								 11556,
								 43333,
								 40000,
								 42000,
								 45000,
								 48000,
								 52000,
								 58000,
								 59000]
				});

				areaLineChart.redraw();
			});



		}
		

		/* ---------- end area spline ---------- */











		/* ---------- circle chart  ---------- */

		if($('#sales__split_location').length) {
			Highcharts.chart('sales__split_location', {

				chart: {
					type: 'solidgauge',
					height: '100%',
				},

				credits: {
					enabled: false
				},

				title: {
					text: '',
				},

				// tooltip: {
				// 	borderWidth: 0,
				// 	backgroundColor: 'none',
				// 	shadow: false,
				// 	style: {
				// 		fontSize: '16px',
				// 	},
				// 	valueSuffix: '%',
				// 	pointFormat: '<span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
				// 	positioner: function (labelWidth) {
				// 		return {
				// 			x: (this.chart.chartWidth - labelWidth) / 2,
				// 			y: (this.chart.plotHeight / 2)
				// 		};
				// 	}
				// },

				tooltip: false,

				pane: {
					startAngle: 0,
					endAngle: 360,
					background: [{
						outerRadius: '128%',
						innerRadius: '0%',
						backgroundColor: Highcharts.color('#A4D4FF').setOpacity(0.3).get(),
						borderWidth: 0
					}]
				},

				yAxis: {
					min: 0,
					max: 100,
					lineWidth: 0,
					tickPositions: []
				},

				plotOptions: {
					solidgauge: {
						dataLabels: {
							enabled: true,
							borderWidth: 0,
							align: 'center',
							x: 0,
	            y: -20,
							format: '{y} %',
							// color: '#000',
							style: {
								fontFamily: 'Poppins',
								fontWeight: '700',
								fontSize: '3.2rem',
								textOutline: 'none',
							},
						},
						linecap: 'round',
						stickyTracking: false,
						rounded: true
					},

					series: {
	            cursor: 'pointer',
	            point: {
	                events: {
	                    mouseOver: function () {
	                        // console.log(this);
	                    }
	                }
	            }
	        }
				},

				series: [{
					name: 'Move',
					data: [{
						color: '#61B3FF',
						radius: '116%',
						innerRadius: '88%',
						y: 74,
					}],
				}, {
					name: 'Exercise',
					data: [{
						color: '#1D92FF',
						radius: '116%',
						innerRadius: '88%',
						y: 54,
						options: {

						}
					}]
				}]
			});
		}

		



		/* ---------- end circle chart ---------- */





		/* ---------- all charts ---------- */



		function hexToRgbA(hex,alpha){
			var c;
			if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
				c= hex.substring(1).split('');
				if(c.length== 3){
					c= [c[0], c[0], c[1], c[1], c[2], c[2]];
				}
				c= '0x'+c.join('');
				return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',' + alpha + ')';
			}
			throw new Error('Bad Hex');
		}



		if($('.dashboard__chart_area').length) {

			document.querySelectorAll('.dashboard__chart_area').forEach(chart => {

				const type = chart.getAttribute('data-chart-type');
				const color = chart.getAttribute('data-chart-color');
				const indicatorsLength = chart.querySelectorAll('.indicator.gt').length;

				if(color !== null) {
					for(let i = indicatorsLength, k = 1; i > 0; i--, k++) {
						const indicator = chart.querySelectorAll('.indicator.gt')[i - 1];
						setTimeout(function() {
							indicator.style.backgroundColor = hexToRgbA(color, 1/indicatorsLength * k);
						}, 0);

					}
				}

				

			});

		}





		// recruitment__analysis

		if($('#recruitment__analysis').length) {

			const chartBox = document.querySelector('#recruitment__analysis .dashboard__chart_area_graph_inner');

			const displayPercents = 24;

			Highcharts.chart(chartBox, {

				chart: {
					type: 'solidgauge',
					height: '100%',
				},

				credits: {
					enabled: false
				},

				title: {
					text: '',
				},

				tooltip: false,

				pane: {
					startAngle: 0,
					endAngle: 360,
					background: [{
						outerRadius: '128%',
						innerRadius: '0%',
						backgroundColor: Highcharts.color('#50D775').setOpacity(0.1).get(),
						borderWidth: 0
					}]
				},

				yAxis: {
					min: 0,
					max: 100,
					lineWidth: 0,
					tickPositions: []
				},

				plotOptions: {
					solidgauge: {
						dataLabels: {
							enabled: true,
							borderWidth: 0,
							align: 'center',
							x: 0,
	            y: -20,
							format: `${displayPercents} %`,
							color: '#50D775',
							style: {
								fontFamily: 'Poppins',
								fontWeight: '700',
								fontSize: '3.2rem',
								textOutline: 'none',
							},
						},
						linecap: 'round',
						stickyTracking: false,
						rounded: true
					},

					series: {
	            cursor: 'pointer',
	            point: {
	                events: {
	                    // mouseOver: function () {
	                    //     // console.log(this);
	                    // }
	                }
	            }
	        }
				},

				series: [{
					name: 'Average',
					data: [{
						color: '#8FE5A7',
						radius: '116%',
						innerRadius: '88%',
						y: 100,
					}],
				}, {
					name: 'Current',
					data: [{
						color: '#50D775',
						radius: '116%',
						innerRadius: '88%',
						y: 24,
						options: {

						}
					}]
				}]
			});
		}





		// recruitment__analysis

		if($('#recruitment__analysis_2').length) {

			const chartBox = document.querySelector('#recruitment__analysis_2 .dashboard__chart_area_graph_inner');

			const displayPercents = 24;

			Highcharts.chart(chartBox, {

				chart: {
					type: 'solidgauge',
					height: '100%',
				},

				credits: {
					enabled: false
				},

				title: {
					text: '',
				},

				tooltip: false,

				pane: {
					startAngle: 0,
					endAngle: 360,
					background: [{
						outerRadius: '128%',
						innerRadius: '0%',
						backgroundColor: Highcharts.color('#50D775').setOpacity(0.1).get(),
						borderWidth: 0
					}]
				},

				yAxis: {
					min: 0,
					max: 100,
					lineWidth: 0,
					tickPositions: []
				},

				plotOptions: {
					solidgauge: {
						dataLabels: {
							enabled: true,
							borderWidth: 0,
							align: 'center',
							x: 0,
	            y: -20,
							format: `${displayPercents} %`,
							color: '#50D775',
							style: {
								fontFamily: 'Poppins',
								fontWeight: '700',
								fontSize: '3.2rem',
								textOutline: 'none',
							},
						},
						linecap: 'round',
						stickyTracking: false,
						rounded: true
					},

					series: {
	            cursor: 'pointer',
	            point: {
	                events: {
	                    // mouseOver: function () {
	                    //     // console.log(this);
	                    // }
	                }
	            }
	        }
				},

				series: [{
					name: 'Average',
					data: [{
						color: '#8FE5A7',
						radius: '116%',
						innerRadius: '88%',
						y: 100,
					}],
				}, {
					name: 'Current',
					data: [{
						color: '#50D775',
						radius: '116%',
						innerRadius: '88%',
						y: 24,
						options: {

						}
					}]
				}]
			});
		}






		// number__of_customers

		if($('#number__of_customers').length) {

			const chartBox = document.querySelector('#number__of_customers .dashboard__chart_area_graph_inner');

			const displayPercents = 54;

			Highcharts.chart(chartBox, {

				chart: {
					type: 'solidgauge',
					height: '100%',
				},

				credits: {
					enabled: false
				},

				title: {
					text: '',
				},

				tooltip: false,

				pane: {
					startAngle: 0,
					endAngle: 360,
					background: [{
						outerRadius: '128%',
						innerRadius: '0%',
						backgroundColor: Highcharts.color('#EFF5FF').setOpacity(1).get(),
						borderWidth: 0
					}]
				},

				yAxis: {
					min: 0,
					max: 100,
					lineWidth: 0,
					tickPositions: []
				},

				plotOptions: {
					solidgauge: {
						dataLabels: {
							enabled: true,
							borderWidth: 0,
							align: 'center',
							x: 0,
							y: -20,
							format: `${displayPercents} %`,
							color: '#1D92FF',
							style: {
								fontFamily: 'Poppins',
								fontWeight: '700',
								fontSize: '3.2rem',
								textOutline: 'none',
							},
						},
						linecap: 'round',
						stickyTracking: false,
						rounded: true
					},

					series: {
						cursor: 'pointer',
					}
				},

				series: [{
					name: 'Average',
					data: [{
						color: '#F05555',
						radius: '116%',
						innerRadius: '88%',
						y: 100,
					}],
				}, {
					name: 'Current',
					data: [{
						color: '#1D92FF',
						radius: '116%',
						innerRadius: '88%',
						y: 54,
						options: {

						}
					}]
				}]
			});
		}





		// order__type_analysis

		if($('#order__type_analysis').length) {

			const chartBox = document.querySelector('#order__type_analysis .dashboard__chart_area_graph_inner');

			const displayPercents = 32;

			Highcharts.chart(chartBox, {

				chart: {
					type: 'solidgauge',
					height: '100%',
				},

				credits: {
					enabled: false
				},

				title: {
					text: '',
				},

				tooltip: false,

				pane: {
					startAngle: 0,
					endAngle: 360,
					background: [{
						outerRadius: '128%',
						innerRadius: '0%',
						backgroundColor: Highcharts.color('#EFF5FF').setOpacity(1).get(),
						borderWidth: 0
					}]
				},

				yAxis: {
					min: 0,
					max: 100,
					lineWidth: 0,
					tickPositions: []
				},

				plotOptions: {
					solidgauge: {
						dataLabels: {
							enabled: true,
							borderWidth: 0,
							align: 'center',
							x: 0,
							y: -20,
							format: `${displayPercents} %`,
							color: '#1D92FF',
							style: {
								fontFamily: 'Poppins',
								fontWeight: '700',
								fontSize: '3.2rem',
								textOutline: 'none',
							},
						},
						linecap: 'round',
						stickyTracking: false,
						rounded: true
					},

					series: {
						cursor: 'pointer',
					}
				},

				series: [{
					name: 'Average',
					data: [{
						color: '#61B3FF',
						radius: '116%',
						innerRadius: '88%',
						y: 100,
					}],
				}, {
					name: 'Current',
					data: [{
						color: '#1D92FF',
						radius: '116%',
						innerRadius: '88%',
						y: 32,
						options: {

						}
					}]
				}]
			});
		}






		if($('.percent__pie').length) {

			document.querySelectorAll('.percent__pie').forEach(pie => {
				const percents = pie.getAttribute('data-pie-percent');
				const pieColor = pie.getAttribute('data-pie-color');
				const svg = pie.querySelector('svg');
				const svgCircle = pie.querySelector('circle');
				const text = pie.querySelector('.percent__pie_text');
				const overlay = pie.querySelector('.percent__pie_overlay');

				pie.style.width = `${percents}%`;
				svg.setAttribute("viewBox", `0 0 ${percents * 2} ${percents * 2}`);
				svgCircle.setAttribute('r', percents/2);
				svgCircle.setAttribute('cx', percents);
				svgCircle.setAttribute('cy', percents);
				svgCircle.setAttribute('stroke', pieColor);
				svgCircle.setAttribute('stroke-width', percents);
				text.textContent = `${percents}%`;
				overlay.style.backgroundColor = pieColor;


				setTimeout(function() {
					pie.classList.add('done');
				}, 0);

			});

		}






		/* ---------- Sales by Employee ---------- */

		if($('#sales__by_employee').length) {
			Highcharts.chart('sales__by_employee', {
				chart: {
					type: 'column',
					height: 240,
					style: {
						fontFamily: 'Poppins',
						fontSize: '1rem',
						fontWeight: '600',
					},
				},
				credits: {
					enabled: false
				},
				title: {
					text: ''
				},
				subtitle: {
					text: ''
				},
				xAxis: {
					categories: [
					'James',
					'Erdogan',
					'Stephen',
					'Freddie',
					'William',
					'Alex',
					'James',
					'Nicholas',
					'William',
					'James',
					],
					crosshair: true,
					labels: {
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4'
						}
					},
					crosshair: false,
				},
				yAxis: {
					min: 0,
					tickInterval: 100000,
					gridLineWidth: 0,
					minorGridLineWidth: 0,
					labels: {
						formatter: function() {
		          if ( this.value > 1000 ) return '£ ' + Highcharts.numberFormat( this.value/1000, 0) + "K";
		          return Highcharts.numberFormat(this.value,0);
		        },
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4',
						},
					},
					title: {
						text: ''
					}
				},
				tooltip: {
					valuePrefix: '£',
					headerFormat: '',
					pointFormat: '<strong style="font-size: 1.4rem">{point.y}</strong><br /><span style="display:block; font-weight: 300; text-align: center;">Total</span>',
					footerFormat: '<span class="angle" style="background: #50D775;"></span>',
					style: {
						color: '#FFFFFF',
						fontWeight: '600',
					},
					shared: true,
					useHTML: true,
					shadow: false,
					borderRadius: 24,
					backgroundColor: '#50D775',
					positioner: function(labelWidth, labelHeight, point) {
			        var tooltipX = point.plotX + 15;
			        var tooltipY = point.plotY - 60;
			        return {
			            x: tooltipX,
			            y: tooltipY
			        };
			    }
				},
				legend: false,
				plotOptions: {
					column: {
						pointPadding: 0,
						borderWidth: 0,
						borderRadius: '0.8rem',
						pointWidth: 30,
						maxPointWidth: 30,
						groupPadding: 0,
					}
				},
				series: [{
					name: 'Sales',
					data: [115000, 420000, 240000, 200000, 160000, 330000, 250000, 190000, 140000, 400000],
					color: hexToRgbA('#50D775', 0.4),
					pointPlacement: 0,
					states: {
						hover: {
							enabled: true,
							color: '#50D775'
						}
					},
				}
				]
			});
		}



		if($('#sales__by_employee_2').length) {
			Highcharts.chart('sales__by_employee_2', {
				chart: {
					type: 'column',
					height: 240,
					style: {
						fontFamily: 'Poppins',
						fontSize: '1rem',
						fontWeight: '600',
					},
				},
				credits: {
					enabled: false
				},
				title: {
					text: ''
				},
				subtitle: {
					text: ''
				},
				xAxis: {
					categories: [
					'James',
					'Erdogan',
					'Stephen',
					'Freddie',
					'William',
					'Alex',
					'James',
					'Nicholas',
					'William',
					'James',
					],
					crosshair: true,
					labels: {
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4'
						}
					},
					crosshair: false,
				},
				yAxis: {
					min: 0,
					tickInterval: 100000,
					gridLineWidth: 0,
					minorGridLineWidth: 0,
					labels: {
						formatter: function() {
		          if ( this.value > 1000 ) return '£ ' + Highcharts.numberFormat( this.value/1000, 0) + "K";
		          return Highcharts.numberFormat(this.value,0);
		        },
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4',
						},
					},
					title: {
						text: ''
					}
				},
				tooltip: {
					valuePrefix: '£',
					headerFormat: '',
					pointFormat: '<strong style="font-size: 1.4rem">{point.y}</strong><br /><span style="display:block; font-weight: 300; text-align: center;">Total</span>',
					footerFormat: '<span class="angle" style="background: #50D775;"></span>',
					style: {
						color: '#FFFFFF',
						fontWeight: '600',
					},
					shared: true,
					useHTML: true,
					shadow: false,
					borderRadius: 24,
					backgroundColor: '#50D775',
					positioner: function(labelWidth, labelHeight, point) {
			        var tooltipX = point.plotX + 15;
			        var tooltipY = point.plotY - 60;
			        return {
			            x: tooltipX,
			            y: tooltipY
			        };
			    }
				},
				legend: false,
				plotOptions: {
					column: {
						pointPadding: 0,
						borderWidth: 0,
						borderRadius: '0.8rem',
						pointWidth: 30,
						maxPointWidth: 30,
						groupPadding: 0,
					}
				},
				series: [{
					name: 'Sales',
					data: [115000, 420000, 240000, 200000, 160000, 330000, 250000, 190000, 140000, 400000],
					color: hexToRgbA('#50D775', 0.4),
					pointPlacement: 0,
					states: {
						hover: {
							enabled: true,
							color: '#50D775'
						}
					},
				}
				]
			});
		}

		/* ---------- Sales by Employee ---------- */





		/* ---------- Average Sales Price by Location ---------- */

		if($('#average__sales_price_by_location').length) {
			Highcharts.chart('average__sales_price_by_location', {
				chart: {
					type: 'column',
					height: 240,
					style: {
						fontFamily: 'Poppins',
						fontSize: '1rem',
						fontWeight: '600',
					},
				},
				credits: {
					enabled: false
				},
				title: {
					text: ''
				},
				subtitle: {
					text: ''
				},
				xAxis: {
					categories: [
					'2010',
					'2011',
					'2012',
					'2013',
					'2014',
					'2015',
					'2016',
					'2017',
					'2018',
					'2019',
					],
					crosshair: true,
					labels: {
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4'
						}
					},
					crosshair: false,
				},
				yAxis: {
					min: 1000,
					tickInterval: 200,
					gridLineWidth: 0,
					minorGridLineWidth: 0,
					labels: {
						// formatter: function() {
		    //       if ( this.value > 1000 ) return '£ ' + Highcharts.numberFormat( this.value/1000, 0) + "K";
		    //       return Highcharts.numberFormat(this.value,0);
		    //     },
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4',
						},
					},
					title: {
						text: ''
					}
				},
				tooltip: {
					valuePrefix: '£',
					headerFormat: '',
					pointFormat: '<strong style="font-size: 1.4rem">{point.y}</strong><br /><span style="display:block; font-weight: 300; text-align: center;">Total</span>',
					footerFormat: '<span class="angle" style="background: #1D92FF;"></span>',
					style: {
						color: '#FFFFFF',
						fontWeight: '600',
					},
					shared: true,
					useHTML: true,
					shadow: false,
					borderRadius: 24,
					backgroundColor: '#1D92FF',
					positioner: function(labelWidth, labelHeight, point) {
			        var tooltipX = point.plotX + 15;
			        var tooltipY = point.plotY - 60;
			        return {
			            x: tooltipX,
			            y: tooltipY
			        };
			    }
				},
				legend: false,
				plotOptions: {
					column: {
						pointPadding: 0,
						borderWidth: 0,
						borderRadius: '0.8rem',
						pointWidth: 30,
						maxPointWidth: 30,
						groupPadding: 0,
					}
				},
				series: [{
					name: 'Sales',
					data: [1080, 1150, 1200, 1300, 1370, 1390, 1400, 1500, 1600, 1800],
					color: hexToRgbA('#1D92FF', 0.4),
					pointPlacement: 0,
					states: {
						hover: {
							enabled: true,
							color: '#1D92FF',
						}
					},
				}
				]
			});
		}


		if($('#average__sales_price_by_location_2').length) {
			Highcharts.chart('average__sales_price_by_location_2', {
				chart: {
					type: 'column',
					height: 240,
					style: {
						fontFamily: 'Poppins',
						fontSize: '1rem',
						fontWeight: '600',
					},
				},
				credits: {
					enabled: false
				},
				title: {
					text: ''
				},
				subtitle: {
					text: ''
				},
				xAxis: {
					categories: [
					'2010',
					'2011',
					'2012',
					'2013',
					'2014',
					'2015',
					'2016',
					'2017',
					'2018',
					'2019',
					],
					crosshair: true,
					labels: {
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4'
						}
					},
					crosshair: false,
				},
				yAxis: {
					min: 1000,
					tickInterval: 200,
					gridLineWidth: 0,
					minorGridLineWidth: 0,
					labels: {
						// formatter: function() {
		    //       if ( this.value > 1000 ) return '£ ' + Highcharts.numberFormat( this.value/1000, 0) + "K";
		    //       return Highcharts.numberFormat(this.value,0);
		    //     },
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4',
						},
					},
					title: {
						text: ''
					}
				},
				tooltip: {
					valuePrefix: '£',
					headerFormat: '',
					pointFormat: '<strong style="font-size: 1.4rem">{point.y}</strong><br /><span style="display:block; font-weight: 300; text-align: center;">Total</span>',
					footerFormat: '<span class="angle" style="background: #1D92FF;"></span>',
					style: {
						color: '#FFFFFF',
						fontWeight: '600',
					},
					shared: true,
					useHTML: true,
					shadow: false,
					borderRadius: 24,
					backgroundColor: '#1D92FF',
					positioner: function(labelWidth, labelHeight, point) {
			        var tooltipX = point.plotX + 15;
			        var tooltipY = point.plotY - 60;
			        return {
			            x: tooltipX,
			            y: tooltipY
			        };
			    }
				},
				legend: false,
				plotOptions: {
					column: {
						pointPadding: 0,
						borderWidth: 0,
						borderRadius: '0.8rem',
						pointWidth: 30,
						maxPointWidth: 30,
						groupPadding: 0,
					}
				},
				series: [{
					name: 'Sales',
					data: [1080, 1150, 1200, 1300, 1370, 1390, 1400, 1500, 1600, 1800],
					color: hexToRgbA('#1D92FF', 0.4),
					pointPlacement: 0,
					states: {
						hover: {
							enabled: true,
							color: '#1D92FF',
						}
					},
				}
				]
			});
		}

		/* ---------- Average Sales Price by Location ---------- */








		/* ---------- Top Sales Period By Tailor ---------- */

		if($('#top__sales_period_by_tailor').length) {
			Highcharts.chart('top__sales_period_by_tailor', {
				chart: {
					type: 'column',
					height: 240,
					style: {
						fontFamily: 'Poppins',
						fontSize: '1rem',
						fontWeight: '600',
					},
				},
				credits: {
					enabled: false
				},
				title: {
					text: ''
				},
				subtitle: {
					text: ''
				},
				xAxis: {
					categories: [
					'August 3rd, 2020',
					'February 25th, 2019',
					'April 18th, 2018',
					'September 17th, 2017',
					'August 13th, 2016',
					],
					crosshair: true,
					labels: {
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4'
						}
					},
					crosshair: false,
				},
				yAxis: {
					min: 0,
					tickInterval: 2000,
					gridLineWidth: 0,
					minorGridLineWidth: 0,
					labels: {
						formatter: function() {
		          if ( this.value > 1000 ) return '£ ' + Highcharts.numberFormat( this.value, 0);
		          return Highcharts.numberFormat(this.value,0);
		        },
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4',
						},
					},
					title: {
						text: ''
					}
				},
				tooltip: {
					valuePrefix: '£',
					headerFormat: '',
					pointFormat: '<strong style="font-size: 1.4rem">{point.y}</strong><br /><span style="display:block; font-size: 1rem; font-weight: 300; text-align: center;">Top Sales</span>',
					footerFormat: '<span class="angle" style="background: #50D775;"></span>',
					style: {
						color: '#FFFFFF',
						fontWeight: '600',
					},
					shared: true,
					useHTML: true,
					shadow: false,
					borderRadius: 24,
					backgroundColor: '#50D775',
					positioner: function(labelWidth, labelHeight, point) {
			        var tooltipX = point.plotX + 30;
			        var tooltipY = point.plotY - 60;
			        return {
			            x: tooltipX,
			            y: tooltipY
			        };
			    }
				},
				legend: false,
				plotOptions: {
					column: {
						pointPadding: 0,
						borderWidth: 0,
						borderRadius: '0.8rem',
						pointWidth: 60,
						maxPointWidth: 60,
						groupPadding: 0,
					}
				},
				series: [{
					name: 'Sales',
					data: [11000, 14000, 13800, 18000, 12000],
					color: hexToRgbA('#50D775', 0.4),
					pointPlacement: 0,
					states: {
						hover: {
							enabled: true,
							color: '#50D775',
						}
					},
				}
				]
			});
		}



		if($('#top__sales_period_by_tailor_2').length) {
			Highcharts.chart('top__sales_period_by_tailor_2', {
				chart: {
					type: 'column',
					height: 240,
					style: {
						fontFamily: 'Poppins',
						fontSize: '1rem',
						fontWeight: '600',
					},
				},
				credits: {
					enabled: false
				},
				title: {
					text: ''
				},
				subtitle: {
					text: ''
				},
				xAxis: {
					categories: [
					'August 3rd, 2020',
					'February 25th, 2019',
					'April 18th, 2018',
					'September 17th, 2017',
					'August 13th, 2016',
					],
					crosshair: true,
					labels: {
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4'
						}
					},
					crosshair: false,
				},
				yAxis: {
					min: 0,
					tickInterval: 2000,
					gridLineWidth: 0,
					minorGridLineWidth: 0,
					labels: {
						formatter: function() {
		          if ( this.value > 1000 ) return '£ ' + Highcharts.numberFormat( this.value, 0);
		          return Highcharts.numberFormat(this.value,0);
		        },
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4',
						},
					},
					title: {
						text: ''
					}
				},
				tooltip: {
					valuePrefix: '£',
					headerFormat: '',
					pointFormat: '<strong style="font-size: 1.4rem">{point.y}</strong><br /><span style="display:block; font-size: 1rem; font-weight: 300; text-align: center;">Top Sales</span>',
					footerFormat: '<span class="angle" style="background: #50D775;"></span>',
					style: {
						color: '#FFFFFF',
						fontWeight: '600',
					},
					shared: true,
					useHTML: true,
					shadow: false,
					borderRadius: 24,
					backgroundColor: '#50D775',
					positioner: function(labelWidth, labelHeight, point) {
			        var tooltipX = point.plotX + 30;
			        var tooltipY = point.plotY - 60;
			        return {
			            x: tooltipX,
			            y: tooltipY
			        };
			    }
				},
				legend: false,
				plotOptions: {
					column: {
						pointPadding: 0,
						borderWidth: 0,
						borderRadius: '0.8rem',
						pointWidth: 60,
						maxPointWidth: 60,
						groupPadding: 0,
					}
				},
				series: [{
					name: 'Sales',
					data: [11000, 14000, 13800, 18000, 12000],
					color: hexToRgbA('#50D775', 0.4),
					pointPlacement: 0,
					states: {
						hover: {
							enabled: true,
							color: '#50D775',
						}
					},
				}
				]
			});
		}

		/* ---------- Top Sales Period By Tailor ---------- */






		


		/* ---------- Top Sales Period By Company ---------- */

		if($('#top__sales_period_by_company').length) {
			Highcharts.chart('top__sales_period_by_company', {
				chart: {
					type: 'column',
					height: 240,
					style: {
						fontFamily: 'Poppins',
						fontSize: '1rem',
						fontWeight: '600',
					},
				},
				credits: {
					enabled: false
				},
				title: {
					text: ''
				},
				subtitle: {
					text: ''
				},
				xAxis: {
					categories: [
					'Thusday <br/> August 3rd, 2020',
					'Friday <br/> February 25th, 2019',
					'Wednesday <br/> April 18th, 2018',
					'Friday <br/> September 17th, 2017',
					'Monday <br/> August 13th, 2016',
					],
					crosshair: true,
					labels: {
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4'
						}
					},
					crosshair: false,
				},
				yAxis: {
					min: 40000,
					tickInterval: 1000,
					gridLineWidth: 0,
					minorGridLineWidth: 0,
					labels: {
						formatter: function() {
		          if ( this.value > 1000 ) return '£ ' + Highcharts.numberFormat( this.value, 0);
		          return Highcharts.numberFormat(this.value,0);
		        },
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4',
						},
					},
					title: {
						text: ''
					}
				},
				tooltip: {
					valuePrefix: '£',
					headerFormat: '',
					pointFormat: '<strong style="font-size: 1.4rem">{point.y}</strong><br /><span style="display:block; font-size: 1rem; font-weight: 300; text-align: center;">Top Sales</span>',
					footerFormat: '<span class="angle" style="background: #F58020;"></span>',
					style: {
						color: '#FFFFFF',
						fontWeight: '600',
					},
					shared: true,
					useHTML: true,
					shadow: false,
					borderRadius: 24,
					backgroundColor: '#F58020',
					positioner: function(labelWidth, labelHeight, point) {
			        var tooltipX = point.plotX + 30;
			        var tooltipY = point.plotY - 60;
			        return {
			            x: tooltipX,
			            y: tooltipY
			        };
			    }
				},
				legend: false,
				plotOptions: {
					column: {
						pointPadding: 0,
						borderWidth: 0,
						borderRadius: '0.8rem',
						pointWidth: 60,
						maxPointWidth: 60,
						groupPadding: 0,
					}
				},
				series: [{
					name: 'Sales',
					data: [48500, 47500, 46500, 45500, 44500],
					color: hexToRgbA('#F58020', 0.4),
					pointPlacement: 0,
					states: {
						hover: {
							enabled: true,
							color: '#F58020',
						}
					},
				}
				]
			});
		}




		if($('#top__sales_period_by_company_2').length) {
			Highcharts.chart('top__sales_period_by_company_2', {
				chart: {
					type: 'column',
					height: 240,
					style: {
						fontFamily: 'Poppins',
						fontSize: '1rem',
						fontWeight: '600',
					},
				},
				credits: {
					enabled: false
				},
				title: {
					text: ''
				},
				subtitle: {
					text: ''
				},
				xAxis: {
					categories: [
					'Thusday <br/> August 3rd, 2020',
					'Friday <br/> February 25th, 2019',
					'Wednesday <br/> April 18th, 2018',
					'Friday <br/> September 17th, 2017',
					'Monday <br/> August 13th, 2016',
					],
					crosshair: true,
					labels: {
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4'
						}
					},
					crosshair: false,
				},
				yAxis: {
					min: 40000,
					tickInterval: 1000,
					gridLineWidth: 0,
					minorGridLineWidth: 0,
					labels: {
						formatter: function() {
		          if ( this.value > 1000 ) return '£ ' + Highcharts.numberFormat( this.value, 0);
		          return Highcharts.numberFormat(this.value,0);
		        },
						style: {
							fontSize: '1rem',
							fontWeight: '600',
							color: '#848DA4',
						},
					},
					title: {
						text: ''
					}
				},
				tooltip: {
					valuePrefix: '£',
					headerFormat: '',
					pointFormat: '<strong style="font-size: 1.4rem">{point.y}</strong><br /><span style="display:block; font-size: 1rem; font-weight: 300; text-align: center;">Top Sales</span>',
					footerFormat: '<span class="angle" style="background: #F58020;"></span>',
					style: {
						color: '#FFFFFF',
						fontWeight: '600',
					},
					shared: true,
					useHTML: true,
					shadow: false,
					borderRadius: 24,
					backgroundColor: '#F58020',
					positioner: function(labelWidth, labelHeight, point) {
			        var tooltipX = point.plotX + 30;
			        var tooltipY = point.plotY - 60;
			        return {
			            x: tooltipX,
			            y: tooltipY
			        };
			    }
				},
				legend: false,
				plotOptions: {
					column: {
						pointPadding: 0,
						borderWidth: 0,
						borderRadius: '0.8rem',
						pointWidth: 60,
						maxPointWidth: 60,
						groupPadding: 0,
					}
				},
				series: [{
					name: 'Sales',
					data: [48500, 47500, 46500, 45500, 44500],
					color: hexToRgbA('#F58020', 0.4),
					pointPlacement: 0,
					states: {
						hover: {
							enabled: true,
							color: '#F58020',
						}
					},
				}
				]
			});
		}

		/* ---------- Top Sales Period By Tailor ---------- */









		/* ---------- end all charts ---------- */























		/* ---------- tasks unit ---------- */


		if($('.tasks__unit').length) {

			function updateTasks() {
				tasksDoneCount = $('.tasks__unit_list_item.done').length,
				tasksTotalCount = $('.tasks__unit_list_item').length,
				tasksDoneProgress = tasksDoneCount/tasksTotalCount * 100;

				$('.tasks__unit_date').text(currentDate);
				$('.tasks__unit_status .done').text(tasksDoneCount);
				$('.tasks__unit_status .total').text(tasksTotalCount);
				$('.tasks__unit_progress_line_fill').css('width', tasksDoneProgress + '%');
			}


			let currentDate = moment().format("D MMMM, dddd"),
					tasksDoneCount = $('.tasks__unit_list_item.done').length,
					tasksTotalCount = $('.tasks__unit_list_item').length,
					tasksDoneProgress = tasksDoneCount/tasksTotalCount * 100;

			updateTasks();


			// Add Task

			let newTaskName = '';

			$('.tasks__unit_creature input').on('input', function(e) {
				newTaskName = e.target.value;
				newTaskName.length > 0 ? $(e.target).parent().stop().addClass('passed') : $(e.target).parent().stop().removeClass('passed');
			});

			$('.tasks__unit_creature_submit').on('click', function() {

				let newTaskHTML = `
					<li class="tasks__unit_list_item new">
						<a href="javascript:void(0);" class="tasks__unit_list_item_done"></a>
						<h6 class="tasks__unit_list_item_title">${newTaskName}</h6>
						<span class="tasks__unit_list_item_time">${moment().format("h:mm A")}</span>
						<span class="tasks__unit_list_item_status">New</span>
					</li>
				`;


				$(this).parents('.tasks__unit').find('.tasks__unit_list').prepend(newTaskHTML);
				$(this).parent().stop().removeClass('passed');
				$(this).parent().find('input').val('');

				updateTasks();
			});




			// Change status

			$(document).on('click', '.tasks__unit_list_item_done', function() {
				let oldStatus = null, oldStatusText = null;
				let classList = $(this).parent().attr('class').split(/\s+/);
				$.each(classList, function(index, className) {
				  switch(className) {
				  	case 'urgent':
				  		oldStatus = 'urgent';
				  		oldStatusText = 'Urgent';
				  		break;
				  	case 'new':
				  		oldStatus = 'new';
				  		oldStatusText = 'New';
				  		break;
				  }
				});


				$(this).parent().stop().toggleClass('done');
				if(!$(this).parent().hasClass('done')) {
					$(this).parent().stop().removeClass('done').addClass(oldStatus);
					oldStatusText !== null ? $(this).parent().find('.tasks__unit_list_item_status').text(oldStatusText) : $(this).parent().find('.tasks__unit_list_item_status').text('No Status');
				}
				else {
					$(this).parent().stop().addClass('done');
					$(this).parent().find('.tasks__unit_list_item_status').text('Done');
				}

				updateTasks();

			});


		}


		// tasks unit







		/* ---------- modal window ---------- */

		document.querySelectorAll('.modal__open').forEach((link) => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				let href = link.getAttribute('href').slice(1);
				document.querySelectorAll('.modal__window').forEach((modalWindow) => {
					let id = modalWindow.getAttribute('id');
					modalWindow.classList.remove('show');
					href == id ? modalWindow.classList.add('show') : null;
				});
			});
		});

		document.addEventListener('click', (e) => {
			e.target.classList.contains('modal__window_close') || 
			e.target.classList.contains('modal__window_close_icon') ||
			e.target.classList.contains('modal__window_close_icon_line') ||
			e.target.classList.contains('modal__window_overlay') ? document.querySelectorAll('.modal__window').forEach((modalWindow) => {
				modalWindow.classList.remove('show');
			}) : null
		});


		/* ---------- end modal window ---------- */

		





		/* ---------- dashboard content tabs ---------- */

		$('.dashboard__content_tabs .dashboard__content_tabs_list li a').on('click', function() {
			$('.dashboard__content_tabs .dashboard__content_tabs_list li').stop().removeClass('active');
			$(this).parent().stop().addClass('active');


			$(window).scrollTop(0);

			$('.dashboard__content_panel').stop().removeClass('active');
			if($('.dashboard__content_panel')[$(this).parent().index()] !== undefined) {
				$('.dashboard__content_panel')[$(this).parent().index()].classList.add('active');
			}
			

		});

		/* ---------- end dashboard content tabs ---------- */







		/* ---------- widgets ---------- */


		if($('.dashboard__widgets').length) {

			let widgetsLength = $('.dashboard__widgets_list_item').length;
			let itemsOnPageCount = 7;
			let widgetsPagesCount = 0;

			for(let i = 0; i < widgetsLength; i+=itemsOnPageCount) {
				widgetsPagesCount++;
			}

			for(let i = 0; i < widgetsPagesCount; i++) {
				$('.dashboard__widgets_list_ppagination').append(`
					<li>
					<a href="javascript:void(0);">${i + 1}</a>
					</li>
					`);
			}


			document.querySelectorAll('.dashboard__widgets_list_ppagination li')[0].classList.add('active');


			$('.dashboard__widgets_list_item').css('display', 'block');

			$('.dashboard__widgets_list_item').each(function(index) {
				index >= itemsOnPageCount ? $(this).css('display', 'none') : null;
			});

			$('.dashboard__widgets_list_ppagination li a').on('click', (e) => {
				let startPoint = ($(e.target).parent().index() + 1) * itemsOnPageCount - itemsOnPageCount;

				if(!$('.dashboard__widgets_list').hasClass('filtered')) {
					$('.dashboard__widgets_list_item').each(function(index) {
						if(index >= startPoint && index < startPoint + itemsOnPageCount) {
							$(this).css('display', 'block');
						} else {
							$(this).css('display', 'none');
						}
					});
				} else {
					$('.dashboard__widgets_list_item:not(.filtered-item)').each(function(index) {
						if(index >= startPoint && index < startPoint + itemsOnPageCount) {
							$(this).css('display', 'block');
						} else {
							$(this).css('display', 'none');
						}
					});
				}



				$('.dashboard__widgets_list_ppagination li').stop().removeClass('active');
				$(e.target).parent().stop().addClass('active');

			});


			$('.dashboard__widgets_list_ppagination_control.prev').on('click', () => {
				if($('.dashboard__widgets_list_ppagination li.active').prev().length) {
					$('.dashboard__widgets_list_ppagination li.active').prev().find('a').click();
				}
			});

			$('.dashboard__widgets_list_ppagination_control.next').on('click', () => {
				if($('.dashboard__widgets_list_ppagination li.active').next().length && $('.dashboard__widgets_list_ppagination li.active').next().attr('style') != 'display: none;') {
					$('.dashboard__widgets_list_ppagination li.active').next().find('a').click();
				}
			});



			function filterFunction() {
				let filter = document.querySelector("[name='filter__widgets_field']").value.toUpperCase();
				let list = document.querySelector('.dashboard__widgets_list');
				let listItems = list.querySelectorAll(".dashboard__widgets_list_item");
				if(filter !== '') {
					for (i = 0; i < listItems.length; i++) {
						let title = listItems[i].querySelector('.dashboard__widgets_list_item_header');
						let txtValue = title.textContent || title.innerText;
						if (txtValue.toUpperCase().indexOf(filter) > -1) {
							listItems[i].style.display = "block";
							listItems[i].classList.remove('filtered-item');
						} else {
							listItems[i].classList.add('filtered-item');
							listItems[i].style.display = "none";

						}
					}

					list.classList.add('filtered');
				}
				else {
					$('.dashboard__widgets_list_ppagination li.active').find('a').click();
					list.classList.remove('filtered');
				}


				$('.dashboard__widgets_list_ppagination li').stop().removeClass('active');
				$('.dashboard__widgets_list_ppagination li')[0].classList.add('active');


				const filteredLength = $('.dashboard__widgets_list [style="display: block;"]').length;
				let filteredPagesCount = 0;

				for(let i = 0; i < filteredLength; i+=itemsOnPageCount) {
					filteredPagesCount++;
				}

				$('.dashboard__widgets_list_ppagination li').css('display', 'none');

				for(let i = 0; i < filteredPagesCount; i++) {
					$($('.dashboard__widgets_list_ppagination li')[i]).css('display', 'block');
				}

				$($('.dashboard__widgets_list_ppagination li')[0]).find('a').click();

				if($('.dashboard__widgets_list_item:not(.filtered-item)').length < itemsOnPageCount) {
					$('.dashboard__widgets_list_ppagination_wrapper').stop().addClass('is-hidden');
				}

			}


			$('.search__widgets').on('click', function() {
				filterFunction();
			});


			$("[name='filter__widgets_field']").on('input', (e) => {
				let value = e.target.value;
				if(value == '') {
					$('.dashboard__widgets_list_item').stop().removeClass('filtered-item');
					$('.dashboard__widgets_list_ppagination li').css('display', 'block');
					$('.dashboard__widgets_list_ppagination li').stop().removeClass('active');
					$('.dashboard__widgets_list_ppagination li')[0].classList.add('active');
					$('.dashboard__widgets_list_ppagination li.active').find('a').click();
					$('.dashboard__widgets_filter .search__widgets').stop().addClass('btn-disabled');
					$('.dashboard__widgets_list_ppagination_wrapper').stop().removeClass('is-hidden');
				} else {
					$('.dashboard__widgets_filter .search__widgets').stop().removeClass('btn-disabled');
				}
			});


			$('.dashboard__widgets_filter').on('submit', (e) => {
				e.preventDefault();
				filterFunction();
			});



			$('.dashboard__widgets_list_item_tabs').each(function() {
				const $this = $(this);
				const controls = $this.find('.dashboard__widgets_list_item_tabs_controls_list');
				controls.find('a').on('click', function() {
					controls.find('li').stop().removeClass('active');
					$(this).parent().stop().addClass('active');
					$this.find('.dashboard__widgets_list_item_tabs_panel').stop().removeClass('active');
					$this.find('.dashboard__widgets_list_item_tabs_panel')[$(this).parent().index()].classList.add('active');
				});

			});



			$('.dashboard__widgets_list_item_toggle').on('click', function() {
				let body = $(this).parents('.dashboard__widgets_list_item').find('.dashboard__widgets_list_item_body');
				$('.dashboard__widgets_list_item').find('.dashboard__widgets_list_item_body').not(body).stop().slideUp(400);
				body.stop().slideToggle(400);
			});

		}


		/* ---------- end widgets ---------- */





		/* ---------- dashboard content nested tabs ---------- */



		$('.dashboard__content_nested_tabs').each(function(){
			const $this = $(this);
			const parentPanel = $this.parents('.dashboard__content_panel');

			$this.find('li a').on('click', function() {
				$this.find('li').stop().removeClass('active');
				$(this).parent().stop().addClass('active');


				$(window).scrollTop(0);

				parentPanel.find('.dashboard__content_nested_panel').stop().removeClass('active');
				if(parentPanel.find('.dashboard__content_nested_panels .dashboard__content_nested_panel')[$(this).parent().index()] !== undefined) {
					parentPanel.find('.dashboard__content_nested_panels .dashboard__content_nested_panel')[$(this).parent().index()].classList.add('active');
				}


			});

		});


		/* ---------- end dashboard content nested tabs ---------- */

		





	}); // END Document Ready











	/*window load*/
	$(window).on('load', function() {

		setTimeout(function() {
			$('[type="checkbox"], [type="radio"], select').styler();
		}, 100);
		


		/* ---------- sortable grid ---------- */

		if(document.querySelector('.components__grid.sortable') !== null) {
			$('.components__grid.sortable .components__grid_column').each(function(i) {
				$(this).attr('data-id', i + 1);
			});
			setTimeout(function() {
				initGrid();
			}, 0);
		}

		// End Sortable Grid

		

	});




	






	/*window resize*/
	$(window).resize(function() {
		
	});




})(jQuery);	


	
<?php require_once("./includes/session.php"); ?>
<?php require_once("./includes/db_connection.php"); ?>
<?php require_once("./includes/functions.php"); ?>
<?php require_once("./includes/validation_functions.php"); ?>
<?php
	$style=array("public","portfolio");
	$collections=array();
	$query="SELECT `id`, `collection` FROM collections ORDER BY `order` ASC";
	if($result=mysqli_query($connection,$query)){
		while ($collection = mysqli_fetch_object($result)){
			$collections[]=$collection;
		}
	}
?>
<!-- Add jQuery library -->
<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>

<!-- Add fancyBox -->
<link rel="stylesheet" href="./fancybox/source/jquery.fancybox.css?v=2.1.5" type="text/css" media="screen" />
<script type="text/javascript" src="./fancybox/source/jquery.fancybox.pack.js?v=2.1.5"></script>

<!-- Optionally add helpers - button, thumbnail and/or media -->
<link rel="stylesheet" href="./fancybox/source/helpers/jquery.fancybox-buttons.css?v=1.0.5" type="text/css" media="screen" />
<script type="text/javascript" src="./fancybox/source/helpers/jquery.fancybox-buttons.js?v=1.0.5"></script>
<script type="text/javascript" src="./fancybox/source/helpers/jquery.fancybox-media.js?v=1.0.6"></script>

	<?php include("./includes/layouts/header.php"); ?>

	<div class='navbar'>
	<?php
	foreach($collections as $post){
		echo "<span class='item' id='{$post->id}'onClick='javascript:changeCollection({$post->id})'><span class='pre'>+</span>{$post->collection}</span> &nbsp ";
	}?>
	</div>
	<div id="dom-target" style="display: none ;">
	<?php
	foreach($collections as $collection){
		$query="SELECT `id`, `title`, `location`, `position`, `src`, `caption`, `size` ";
		$query.="FROM portfolio WHERE collection_id={$collection->id}";
		if($result=mysqli_query($connection,$query)){
			while($row = mysqli_fetch_assoc($result)){
				echo "{$collection->id}%d{$row["id"]}%d{$row["title"]}%d{$row["location"]}%d{$row["position"]}%d{$row["src"]}%d{$row["caption"]}%d{$row["size"]}";
				echo "%obj";
			}
		}
	}
		?>
	</div>
	<div id="main"  style="width:100%">
		<a href="http://www-scf.usc.edu/~later/itp104/final/portfoliohome.html">Old version: first website (just css)</a>
	</div>

<script>
	//disseminate php
    var div = document.getElementById("dom-target");
    var data = div.textContent;
	data=data.trim();
	data=data.split("%obj");
	var collections=[];
	//collections[collection[location[images by position]]]
	for (var i=0;i<data.length;i++){
			var t = data[i].split("%d");
			if(t[0]){
				var image = {
					id: t[1],
					title: t[2],
					location: t[3],
					position: t[4],
					source: t[5],
					caption: t[6],
					size: t[7]
				}

				if(!collections[t[0]])
					collections[t[0]]=[];
				if(!collections[t[0]][image.location])
					collections[t[0]][image.location]=[];

				collections[t[0]][image.location][image.position]=image;

			}
	}
	var openPost=-1;
	changeCollection(7);
	function changeCollection(idElement) {
		var loggedIn=false;
		var element;
		<?php if(logged_in())echo "loggedIn=true;";?>
		if(openPost>0){
			element=document.getElementById(openPost).getElementsByClassName("pre")[0];
			element.innerHTML="+";
		}
		openPost=idElement;
		element = document.getElementById(idElement).getElementsByClassName("pre")[0];
		element.innerHTML="-";
		element = document.getElementById("main");

		var html="";
		for(var i=0;i<4;i++){
			if(collections[idElement][i]){
				if(i>0)
					html+="<div class=\"column\">";

				for(var j=0;j<collections[idElement][i].length;j++){
					if(collections[idElement][i][j]){
						html+="<div class=\""+collections[idElement][i][j].size;
						if(i>0) html+=" left";
						html+="\">"
						html+="<a class=\"fancybox\" rel=\"group\" href=\""+collections[idElement][i][j].source+"\">";
						html+="<img class=\""+collections[idElement][i][j].size+"\"";
						html+="src=\""+collections[idElement][i][j].source+"\"/>";
						html+="</a>";
						html+="<p><h3>"+collections[idElement][i][j].title+"</h3>";
						html+=collections[idElement][i][j].caption+"</p><hr></div>";
					}
				}
				if(i>0)
					html+="</div>";

			}
		}
		element.innerHTML=html;
	}

</script>
<script type="text/javascript">

	$(document).ready(function() {
		$(".fancybox")
		.attr('rel', 'gallery')
		.fancybox({
			padding : 0,
			beforeShow: function () {
            /* Disable right click */
            $.fancybox.wrap.bind("contextmenu", function (e) {
                    return false;
            });
			},
			openEffect  : 'none',
			closeEffect : 'none',
			nextEffect  : 'none',
			prevEffect  : 'none',
			margin      : [20, 60, 20, 60] // Increase left/right margin
		});
	});


</script>
<?php include("./includes/layouts/footer.php"); ?>

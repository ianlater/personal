<?php require_once("./includes/session.php"); ?>
<?php require_once("./includes/db_connection.php"); ?>
<?php require_once("./includes/functions.php"); ?>
<?php require_once("./includes/validation_functions.php"); ?>
<?php 
	$style=array("public","portfolio");
	$dirbar=array();
	$query="SELECT `id`, `title`, `visible` FROM posts ORDER BY `order` ASC";
	if($result=mysqli_query($connection,$query)){
		while ($row = mysqli_fetch_object($result)){
			$dirbar[]=$row;
		}
	}
?>

	<?php include("./includes/layouts/header.php"); ?>

	
	
	<div class='dirbar'>
	<?php
	foreach($dirbar as $post){
		if(logged_in()||$post->visible){
		echo "<span class='item' id='{$post->id}'onClick='javascript:changePost({$post->id})'><span class='pre'>+</span>{$post->title}</span><br><hr>";
		}
	}?>
	</div>
	<div id="dom-target" style="display: none ;">
	<?php
	$query="SELECT `id`, `images`, `bio`, `visible` FROM posts ";
	if($result=mysqli_query($connection,$query)){
		while($row = mysqli_fetch_assoc($result)){
			echo "{$row["id"]}%d{$row["bio"]}%d{$row["images"]}";
			echo "%obj";
		}
	}
	?>
	</div>
	<div id="main" >
		
	</div>
	
<script>
	
    var div = document.getElementById("dom-target");
    var data = div.textContent
	data=data.trim();
	data=data.split("%obj");
	var posts=[];
	for (var i=0;i<data.length;i++){
			var t = data[i].split("%d");
			var post = {
				id: t[0],
				images: t[2],
				bio: t[1],
			}
			if(post.images) post.images=post.images.split(",");	
			posts[post.id]=post;
		
	}
	var openPost=-1;
	changePost(13);
	function changePost(idElement) {
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
		if(posts[idElement].images!=null&&posts[idElement].images.length>0){
			html+="<div class='photos'>";
			for(var i=0;i<posts[idElement].images.length;i++){
				html+="<img src='"+posts[idElement].images[i]+"'/>";
			}
			html+="</div>";
		}
		else 
			html+="<h2 style=\"font-style:italic;\">pictures  soon!</h2>"
		html+=posts[idElement].bio;
		if(loggedIn)html+="<br/><br/><a href='./edit_post.php?id="+openPost+"'>edit post</a>";
		element.innerHTML=html;
	}		
	
</script>
<?php include("./includes/layouts/footer.php"); ?>
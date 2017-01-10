<?php require_once("./includes/session.php"); ?>
<?php require_once("./includes/db_connection.php"); ?>
<?php require_once("./includes/functions.php"); ?>
<?php require_once("./includes/validation_functions.php"); ?>
<?php 
$id;$title="";$bio="";$images="";$visible=1;
if(is_admin()){
if(isset($_POST["submit"])){
	
	$id=$_SESSION["id"];
	$title=$_POST["title"];
	$bio=($_POST["bio"]);
	$images=($_POST["images"]);
	if(isset($_POST["visible"])&&$_POST["visible"]=="yes")
		$visible=1;
	else
		$visible=0;
	  // validations
	  $required_fields = array("title", "bio");
	  validate_presences($required_fields);
	  $fields_with_max_lengths = array("title" => 55 , "bio" => 1800, "images"=>1500);
	  validate_max_lengths($fields_with_max_lengths);
	
	if(empty($errors)){
		
		$title = mysql_prep($_POST["title"]);
		
		$bio = mysql_prep($_POST["bio"]);
		$bio=htmlentities($bio);
		$query  = "UPDATE posts SET";
		$query .= "  `title`='{$title}', `bio`='{$bio}' , `images`='{$images}', `visible`={$visible} ";
		$query .= "WHERE `id`={$id}";
		$result = mysqli_query($connection, $query);

		if ($result) {
			  // Success
			  $_SESSION["message"] = "Post created.";
			  redirect_to("./projects.php");
		} 
		else {
		  // Failure
		  $_SESSION["message"] = "Post creation failed.";
		}
	}
	
}
else{
	if(isset($_GET["id"])){
		$id=$_GET["id"];
		$_SESSION["id"]=$id;
		$query="SELECT `title`, `images`, `bio`, `visible` FROM `posts` WHERE `id`={$id}";
		$result = mysqli_query($connection, $query);
		if ($result) {
			if($row=mysqli_fetch_assoc($result)){
				$title=$row["title"];
				$bio=html_entity_decode($row["bio"]);
				$images=($row["images"]);
				$visible=$row["visible"];
			}
			else $error=true;
		}
		else $error=true;
		if(isset($error)) $_SESSION["message"] = "Couldn't retrieve post";
	}

}
}else{
		$_SESSION["message"]="Sorry, you lack access to this feature.";
	}
?>


<?php include("./includes/layouts/header.php"); ?>

<div class="container">
    <?php echo message(); ?>
    <?php echo form_errors($errors); ?>
    
    <h2>Edit Post</h2>
		<form method="post" action="" name="editPost" id="editPost">
			<label> Title: </label><input type="text" name="title" value="<?php echo $title;?>"> <br/>
			<label> Bio: </label><br/><textarea name="bio" style="min-height:50px;min-width:350px;" form="editPost"><?php echo($bio);?></textarea> <br/>
			<label> Images (separate urls by commas): </label><textarea name="images" style="min-height:50px;min-width:350px;" form="editPost"><?php echo($images);?></textarea> <br/>
			<label> Make Visible?</label> <input type="checkbox" name="visible" value="yes" <?php if($visible) echo "checked";?>><br/>
			<input type="submit" value="Done" name="submit">
		</form>
		
</div><!-- close container-->

<?php include("./includes/layouts/footer.php"); ?>
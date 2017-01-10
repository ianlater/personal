<?php require_once("./includes/session.php"); ?>
<?php require_once("./includes/db_connection.php"); ?>
<?php require_once("./includes/functions.php"); ?>
<?php require_once("./includes/validation_functions.php"); ?>
<?php confirm_admin(); ?>
<?php 
	$title="";$bio="";$tags=array(); $category=""; $images="";$visible=1;
	$t=mysqli_fetch_assoc(mysqli_query($connection, "SELECT`order` FROM `posts` ORDER BY `order` ASC  LIMIT 1"));
		$order=$t["order"]-1;		
if(is_admin()){
if(isset($_POST["submit"])){
	$title=$_POST["title"];
	$bio=$_POST["bio"];
	$images=($_POST["images"]);
	if(isset($_POST["visible"])&&$_POST["visible"]=="yes")
		$visible=1;
	else
		$visible=0;
	  // validations
	  $required_fields = array("title", "bio");
	  validate_presences($required_fields);
	  $fields_with_max_lengths = array("title" => 55 , "bio" => 800, "images"=>1500);
	  validate_max_lengths($fields_with_max_lengths);
	
	
	if(empty($errors)){
		
		$title = mysql_prep($_POST["title"]);
		
		$bio = mysql_prep($_POST["bio"]);
		$bio=htmlentities($bio);
		
		$query  = "INSERT INTO posts (";
		$query .= "  `title`, `bio`, `images`, `order`, `visible` ";
		$query .= ") VALUES (";
		$query .= "  '{$title}', '{$bio}' ,'{$images}' ,'{$order}', {$visible} ";
		$query .= ")";
		$result = mysqli_query($connection, $query);
		if ($result) {
			  // Success
			  $_SESSION["message"] = "Post created.";
			  redirect_to("./projects.php");
		} 
		else {
		  // Failure
		  $_SESSION["message"] = "Post creation failed.\n{$query}";
		}
  }
}
}else{
	$_SESSION["message"]="Sorry, you don't have access to this feature";
}

?>


<?php include("./includes/layouts/header.php"); ?>

<div class="container">
    <?php echo message(); ?>
    <?php echo form_errors($errors);?>
    
    <h2>Create Post</h2>
	
		<form method="post" action="" name="newPost" id="newPost">
		
			<label> Title: </label><input type="text" name="title" value="<?php echo $title;?>"> <br/>
			<label> Bio: </label><?php echo signal_required(); ?><br/><textarea name="bio" style="min-height:50px;min-width:350px;" form="newPost"><?php echo $bio;?></textarea> <br/>
			<label> Images (separate urls by commas): </label><textarea name="images" style="min-height:50px;min-width:350px;" form="newPost" ><?php echo $images;?></textarea> <br/>
			<label> Make Visible?</label> <input type="checkbox" name="visible" value="yes" <?php if($visible) echo "checked";?>><br/>
			<input type="submit" value="Done" name="submit">
		</form>
		
</div><!-- close container-->

<?php include("./includes/layouts/footer.php"); ?>
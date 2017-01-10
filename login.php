<?php require_once("./includes/session.php"); ?>
<?php require_once("./includes/db_connection.php"); ?>
<?php require_once("./includes/functions.php"); ?>
<?php require_once("./includes/validation_functions.php"); ?>

<?php 
	$username="";
if (isset($_POST['submit'])) {
	$username=$_POST["username"];

	  // validations
	  $required_fields = array("username", "password");
	  validate_presences($required_fields);
  
	
	if(empty($errors)){
		$password=$_POST["password"];
		$user=attempt_login($username, $password);
		if($user){
			$_SESSION["user_id"] = $user["id"];
			$_SESSION["username"] = $user["username"];
			$_SESSION["privilege"] = $user["privilege"];
			redirect_to("Default.php");
		}else{
			$_SESSION["message"] = "Username/password not found.";
		}
  }
}

?>


<?php include("./includes/layouts/header.php"); ?>
<div class="container">
    <?php echo message(); ?>
    <?php echo form_errors($errors); ?>
    
    <h2>Login</h2>  <h3><a href="new_user.php">create user</a></h3>
		<form method="post" action="" name="userEntry">
		
			<label> username or email: </label><input type="text" name="username" value="<?php echo $username;?>">
			<label> password: </label><input type="password" name="password">
			<input type="submit" value="Enter" name="submit">
		</form>
	
</div><!-- close container-->

<?php include("./includes/layouts/footer.php"); ?>
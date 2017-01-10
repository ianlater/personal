<?php require_once("./includes/session.php"); ?>
<?php require_once("./includes/db_connection.php"); ?>
<?php require_once("./includes/functions.php"); ?>
<?php require_once("./includes/validation_functions.php"); ?>

<?php 
	$username="";$confirmPassword="";$password="";
if(isset($_POST["submit"])){
	$username=$_POST["username"];
	$password=$_POST["password"];
	$confirmPassword=$_POST["confirmPassword"];
	  // validations
	  $required_fields = array("username", "password","confirmPassword");
	  validate_presences($required_fields);
	  $fields_with_max_lengths = array("username" => 30 , "password" => 50);
	  validate_max_lengths($fields_with_max_lengths);
	  if(!($confirmPassword===$password))
		$errors["password"]= "passwords don't match";
  
	
	$username=$_POST["username"];
	if(empty($errors)){
		$password=$_POST["password"];
		$username = mysql_prep($_POST["username"]);
		$hashed_password = password_encrypt($_POST["password"]);
		
		$query  = "INSERT INTO users (";
		$query .= "  username, hashed_password";
		$query .= ") VALUES (";
		$query .= "  '{$username}', '{$hashed_password}'";
		$query .= ")";
		$result = mysqli_query($connection, $query);

		if ($result) {
		  // Success
		  $_SESSION["message"] = "User created.";
		  redirect_to("login.php");
		} 
		else {
		  // Failure
		  $_SESSION["message"] = "User creation failed.";
		}
  }
}

?>


<?php include("./includes/layouts/header.php"); ?>

<div class="container">
    <?php echo message(); ?>
    <?php echo form_errors($errors); ?>
    
    <h2>Create User</h2>
		<form method="post" action="" name="userEntry">
		
			<label> username: </label><input type="text" name="username" value="<?php echo $username;?>"> <br/>
			<label> password: </label><input type="password" name="password"> <br/>
			<label> confirm password: </label><input type="password" name="confirmPassword"> 
			<input type="submit" value="Go" name="submit">
		</form>
		
</div><!-- close container-->

<?php include("./includes/layouts/footer.php"); ?>
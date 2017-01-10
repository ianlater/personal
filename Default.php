<?php require_once("./includes/session.php"); ?>
<?php require_once("./includes/db_connection.php"); ?>
<?php require_once("./includes/functions.php"); ?>
<?php require_once("./includes/validation_functions.php"); ?>
<?php 
	$style=array("public","portfolio");
?>

	<?php include("./includes/layouts/header.php"); ?>

	
	
	<div id="welcome" >
		<h2 style="text-align:center;font-family:font-family: HelveticaNeue, 'Helvetica Neue Heavy', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; 
	   font-weight: 300;">Ian Jeffries Later</h2>
		<div class="row">
			<a href="./projects.php"><div class="thumb with_text"><img class="thumb" src="http://www-scf.usc.edu/~later/itp104/final/photos/draw/IMG_3480009.JPG"/><h2>Projects</h2></div></a>
			<a href="./portfolio.php"><div class="thumb with_text"><img class="thumb" src="https://scontent-ams.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/1509945_10153151809278703_2969513686358994283_n.jpg?oh=31a23b6271bd22b646cb3c144b77e8c0&oe=55B91250"/><h2>Photos</h2></div></a>
			<a class="tooltip" href="mailto:later@usc.edu"><span>Email works best:<br/>later@usc.edu</span><div class="thumb with_text"><img class="thumb" src="https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/7/005/087/305/30b3ef0.jpg"/><h2>Contact Me</h2></div></a>
		</div>
		<div class="row">
		<br class="clear"/><hr/>
			<a href="https://github.com/ilater"><img class="thumb" src="https://rrze-pp.github.io/rrze-icon-set/images/GitHub_Logo.png"/></a>
			<a href="https://www.linkedin.com/in/ianlater"><img class="thumb" src="http://www.iconarchive.com/download/i54049/danleech/simple/linkedin.ico"/></a>
			<p id="blank">Consider blank space--<br/>sometimes it's okay to be<br/><a href="http://en.wikipedia.org/wiki/Wabi-sabi"target="_blank">just wabi-sabi.</a></p>
			</div>
		<br class="clear"/>
		<p style="text-align:center;">Computer Science and Computational Neuroscience at University of Southern California
		<br/>
		Otherwise: Food, Art, Music, Camping  </p>
		<hr style="width:315px">
		<div class="triangle"></div>
	</div>


<?php include("./includes/layouts/footer.php"); ?>
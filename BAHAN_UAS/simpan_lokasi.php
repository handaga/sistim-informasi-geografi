<?php 

	/*
		1. membaca parameters yang dikirim oleh ajax
		2. koneksi dengan server basisdata
		3. simpan data lokasi
	*/

		// $_POST['lat'];
		// membaca parameter ajax
		$lat = $_REQUEST['lat'];
		$lng = $_REQUEST['lng'];

		// koneksi ke basisdata server

		$servername = "localhost";
		$username = "root";
		$password = "";
		$database = "peta";

		// Create connection
		$conn = mysqli_connect($servername, $username, $password, $database);

		// Check connection
		if (!$conn) {
		    die("Connection failed: " . mysqli_connect_error());

		}

		// echo "Connected successfully";
		// menyimpn data ke table
		$sql = "INSERT INTO lokasi (latitude, longitude, tanggal)
		        VALUES ($lat, $lng, now() )";
		$result = $conn->query($sql);

		echo json_encode(["status"=>"successfull"]);



?>
<?php
// URL of the CSV file
$csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQq8W35GpzeWmrmEkbtZGdFE8PC_Xw-ZggwIo6UHi5GBKFWZSwrmNrEdO_Wbtz_fUAsrn4J-r1-Exgv/pub?output=csv";

// Get the CSV content
$csvContent = file_get_contents($csvUrl);

// Check if we got the content
if ($csvContent === false) {
    die("Failed to load CSV file.");
}

// Output raw content
header("Content-Type: text/plain");
echo $csvContent;
?>

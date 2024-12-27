<script>
    document.addEventListener("DOMContentLoaded", function () {
        const toggleSwitch = document.querySelector(".toggle-switch input");
        const favicon = document.getElementById("favicon");

        // Function to update the favicon
        function updateFavicon(isDarkMode) {
            favicon.href = isDarkMode ? "akfavicon2.ico" : "akfavicon1.ico";
        }

        // Initial favicon setting based on the toggle state
        updateFavicon(toggleSwitch.checked);

        // Add event listener to the toggle switch
        toggleSwitch.addEventListener("change", function () {
            updateFavicon(toggleSwitch.checked);
        });
    });
</script>

document.addEventListener("DOMContentLoaded", function() {
    const createBlogBtn = document.getElementById("createBlogBtn");
    const blogModal = document.getElementById("blogModal");
    const closeModal = document.getElementById("closeModal");
    const blogForm = document.getElementById("blogForm");
    const blogList = document.getElementById("blogList");

    // Fetch existing blogs
    async function fetchBlogs() {
        const response = await fetch("/api/blogs");
        const blogs = await response.json();
        renderBlogList(blogs);
    }

    // Render blog posts in the list
    function renderBlogList(blogs) {
        blogList.innerHTML = '';
        blogs.forEach(blog => {
            const blogDiv = document.createElement("div");
            blogDiv.classList.add("blog-item");
            blogDiv.innerHTML = `
                <h3>${blog.title}</h3>
                <p>${blog.content.substring(0, 100)}...</p>
                <button onclick="editBlog('${blog._id}')">Edit</button>
                <button onclick="deleteBlog('${blog._id}')">Delete</button>
            `;
            blogList.appendChild(blogDiv);
        });
    }

    // Open modal to create new blog
    createBlogBtn.addEventListener("click", function() {
        blogModal.style.display = "flex";
        blogForm.reset();
    });

    // Close the modal
    closeModal.addEventListener("click", function() {
        blogModal.style.display = "none";
    });

    // Handle form submission for creating or updating a blog
    blogForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;

        const response = await fetch("/api/blogs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, content })
        });

        if (response.ok) {
            alert("Blog post created successfully!");
            fetchBlogs();
            blogModal.style.display = "none";
        } else {
            alert("Error creating blog post.");
        }
    });

    // Fetch blogs when the page loads
    fetchBlogs();
});

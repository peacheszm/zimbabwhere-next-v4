// Authentication functions
export async function registerUser(userData) {
  try {
    if (!process.env.NEXT_PUBLIC_WP_SITE_URL) {
      throw new Error("NEXT_PUBLIC_WP_SITE_URL not configured");
    }

    const wordpressUrl = process.env.NEXT_PUBLIC_WP_SITE_URL;
    const registerUrl = `${wordpressUrl}/?rest_route=/simple-jwt-login/v1/users`;

    const response = await fetch(registerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone_number: userData.phone_number || "",
        AUTH_KEY: process.env.NEXTAUTH_SECRET,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.data?.message || data.message || "Registration failed"
      );
    }

    if (!data.success) {
      throw new Error(data.data?.message || "Registration failed");
    }

    return data.data;
  } catch (error) {
    console.error("💥 Registration error:", error);
    throw error;
  }
}

export async function authenticateUser(login, password) {
  try {
    if (!process.env.NEXT_PUBLIC_WP_SITE_URL) {
      throw new Error("NEXT_PUBLIC_WP_SITE_URL not configured");
    }

    const wordpressUrl = process.env.NEXT_PUBLIC_WP_SITE_URL;
    const authUrl = `${wordpressUrl}/?rest_route=/simple-jwt-login/v1/auth`;

    console.log(authUrl);

    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: login,
        password: password,
        AUTH_KEY: process.env.NEXTAUTH_SECRET,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.data?.message || data.message || "Authentication failed"
      );
    }

    if (!data.success) {
      throw new Error(data.data?.message || "Authentication failed");
    }

    return data.data;
  } catch (error) {
    console.error("💥 Authentication error:", error);
    throw error;
  }
}

export async function validateJWTToken(token) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_SITE_URL}/?rest_route=/simple-jwt-login/v1/validate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jwt: token,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Token validation failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error validating JWT token:", error);
    throw error;
  }
}

// Password reset functions
export async function requestPasswordReset(email) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_SITE_URL}/?rest_route=/simple-jwt-login/v1/user/reset_password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          AUTH_KEY: process.env.NEXTAUTH_SECRET,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.data?.message ||
          errorData.message ||
          "Failed to request password reset"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error;
  }
}
export async function resetPasswordWithCode(email, code, newPassword) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_SITE_URL}/?rest_route=/simple-jwt-login/v1/user/reset_password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          code: code,
          new_password: newPassword,
          AUTH_KEY: process.env.NEXTAUTH_SECRET,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.data?.message ||
          errorData.message ||
          "Failed to reset password"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error resetting password with code:", error);
    throw error;
  }
}
export async function resetPasswordWithJWT(email, newPassword, jwtToken) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WP_SITE_URL}/?rest_route=/simple-jwt-login/v1/user/reset_password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          email: email,
          new_password: newPassword,
          AUTH_KEY: process.env.NEXTAUTH_SECRET,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.data?.message ||
          errorData.message ||
          "Failed to reset password"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}

from sympy import symbols, Eq, solve

# Define the variables and parameters
x, y, z, u, v, w = symbols('x y z u v w')

# Define the system of equations
equations = [
    Eq((x - 358223082178021) * (26 - v) - (y - 283337523369166) * (-132 - u), 0),
    Eq((y - 283337523369166) * (10 - w) - (z - 280863695613761) * (26 - v), 0),
    Eq((x - 385736685098538) * (104 - v) - (y - 233863646936398) * (-164 - u), 0),
    Eq((y - 233863646936398) * (-29 - w) - (z - 303401296818020) * (104 - v), 0),
    Eq((x - 346798149439330) * (47 - v) - (y - 276366698728351) * (-126 - u), 0),
    Eq((y - 276366698728351) * (-355 - w) - (z - 475005921988700) * (47 - v), 0)
]

# Specify the initial guess for the solution
initial_guess = {u: 0, v: 0, w: 0}

# Use the solve function to find a numerical solution
numerical_solution = solve(equations, (x, y, z, u, v, w), dict=True, numeric=True, initial=initial_guess)

# Print the numerical solution
print("Numerical Solution:")
print(numerical_solution)
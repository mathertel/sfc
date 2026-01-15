rem copy all files to deployed into the build folder 
rem 

rmdir /S /Q build
mkdir build

copy *.sfc build
copy *.js build

pause


dir 
dir build 

pause 
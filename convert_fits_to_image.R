#!/usr/bin/Rscript
library(astro)

args = commandArgs(trailingOnly=TRUE)
if (length(args)==0) {
  stop("Error: First argument must be input file.\n", call.=FALSE)
} else if (length(args)==1) {
  # default output file
  input_file <- args[1]
  output_file <- paste("./png/", basename(input_file), ".png", sep="")
  plotfits(input_file, func="log", type="png", file=output_file, res=1, width=4553*2, height=4553*2)
}
